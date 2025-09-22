import os, mimetypes
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from .models import Resume, JobListing
from .serializers import RegisterSerializer, JobListingSerializer, ResumeSerializer
from .permissions import IsPremium
from .scoring import extract_text_from_upload, ats_friendly_heuristics, keyword_score
from .tasks import compute_match_scores_for_user
from .billing import create_checkout_session, parse_webhook

User = get_user_model()

def _apply_visibility_gate(request, item_or_dict):
    """
    Mutates item_or_dict (dict) to enforce premium visibility:
    - premium users: show real match_score, not locked
    - free users: hide real score, send a blurred-friendly hint and locked flag
    """
    user = request.user if request.user.is_authenticated else None
    is_premium = bool(user and getattr(user, "is_premium", False))
    if is_premium or getattr(settings, "SHOW_MATCH_TO_FREE", False):
        # Show everything
        item_or_dict["locked"] = False
        item_or_dict.setdefault("score_hint", None)
        return

    # Free users — hide actual % but send a bucketed hint for teasing
    real = item_or_dict.get("match_score")
    if real is not None:
        # Bucket to nearest 10 (80, 90, etc.) so we don't leak precision
        hint = int(round(real / 10.0) * 10)
    else:
        hint = None

    item_or_dict["score_hint"] = hint
    item_or_dict["locked"] = True
    item_or_dict["match_score"] = None
    # Also hide detailed matches
    item_or_dict["matched_keywords"] = []

@api_view(["GET"])
@permission_classes([AllowAny])
def health(_):
    return Response({"ok": True, "status": "healthy"})

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    ser = RegisterSerializer(data=request.data)
    if ser.is_valid():
        u = ser.save()
        return Response({"id": u.id, "username": u.username}, status=201)
    return Response(ser.errors, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upgrade(request):
    user = request.user
    user.is_premium = True
    user.save(update_fields=["is_premium"])
    return Response({"is_premium": True})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def resume_upload(request):
    f = request.FILES.get("file")
    if not f:
        return Response({"detail":"No file provided"}, status=400)

    file_format = (mimetypes.guess_extension(f.content_type) or "").replace(".","")
    if not file_format:
        name = f.name.lower()
        if name.endswith(".pdf"): file_format = "pdf"
        elif name.endswith(".docx"): file_format = "docx"
        else: file_format = "bin"

    res = Resume.objects.create(user=request.user, file=f, file_format=file_format)
    # Local temp path (works for S3 too via storage's path or temporary file)
    path = res.file.path if hasattr(res.file, "path") else None
    if not path:
        # for storages without local path, save to a temp file for parsing
        import tempfile
        tmp = tempfile.NamedTemporaryFile(delete=False)
        tmp.write(res.file.read()); tmp.close()
        path = tmp.name

    text = extract_text_from_upload(path, file_format)
    ok, issues = ats_friendly_heuristics(text, file_format)

    res.text = text[:200000]  # avoid extreme size
    res.save(update_fields=["text"])

    # Queue background task to compute match scores
    compute_match_scores_for_user.delay(request.user.id)

    return Response({
        "resume_id": res.id,
        "ats_friendly": ok,
        "issues": issues,
        "chars": len(text),
    }, status=201)

@api_view(["GET"])
@permission_classes([AllowAny])  # listing visible to all; scores depend on auth/premium
def jobs_list(request):
    from .models import Resume, JobListing
    from .serializers import JobListingSerializer
    from .scoring import keyword_score

    qs = JobListing.objects.all().order_by("-created_at")

    keyword = request.GET.get("keyword")
    location = request.GET.get("location")
    if keyword:
        qs = qs.filter(
            Q(title__icontains=keyword) |
            Q(company__icontains=keyword) |
            Q(description__icontains=keyword)
        )
    if location:
        qs = qs.filter(location__icontains=location)

    items = []
    user = request.user if request.user.is_authenticated else None

    if user and (user.is_premium or getattr(settings, "SHOW_MATCH_TO_FREE", False)):
        # Prefetch stored scores in a single query
        from .models import MatchScore
        ms = MatchScore.objects.filter(user=user, job_id__in=qs.values_list("id", flat=True))
        stored = {m.job_id: m.score_percentage for m in ms}
    else:
        stored = {}

    latest_resume = None
    resume_text = ""
    if user and not stored:  # fallback compute if no precomputed
        latest_resume = Resume.objects.filter(user=user).order_by("-uploaded_at").first()
        if latest_resume:
            resume_text = (latest_resume.text or "").lower()

    for job in qs[:200]:
        match_score = stored.get(job.id)
        if match_score is None and latest_resume:
            match_score = keyword_score(resume_text, job.title, job.keywords or [])
        data = JobListingSerializer(job).data
        data["match_score"] = match_score
        data["matched_keywords"] = []
        if match_score is not None and resume_text:
            data["matched_keywords"] = [k for k in (job.keywords or []) if k.lower() in resume_text]
        _apply_visibility_gate(request, data)
        items.append(data)

    sort = request.GET.get("sort")
    if sort == "match":
        if not (user and user.is_premium):
            return Response({"warning": "Premium required for sort=match", "results": items})
        items.sort(key=lambda x: (x.get("match_score") or 0), reverse=True)

    return Response(items)

@api_view(["GET"])
@permission_classes([AllowAny])
def job_detail(request, pk: int):
    from .models import Resume, JobListing
    from .serializers import JobListingSerializer
    from .scoring import keyword_score

    try:
        job = JobListing.objects.get(pk=pk)
    except JobListing.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    data = JobListingSerializer(job).data
    if request.user.is_authenticated:
        resume = Resume.objects.filter(user=request.user).order_by("-uploaded_at").first()
        if resume:
            rt = (resume.text or "").lower()
            data["match_score"] = keyword_score(rt, job.title, job.keywords or [])
            data["matched_keywords"] = [k for k in (job.keywords or []) if k.lower() in rt]
    
    _apply_visibility_gate(request, data)
    return Response(data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_checkout(request):
    try:
        session = create_checkout_session(request.user.id)
        return Response({"url": session.url})
    except Exception as e:
        return Response({"detail": str(e)}, status=400)

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def stripe_webhook(request):
    sig = request.META.get("HTTP_STRIPE_SIGNATURE", "")
    try:
        event = parse_webhook(request.body, sig)
    except Exception as e:
        return Response({"detail": "Invalid webhook: " + str(e)}, status=400)

    # Recognize successful checkout
    if event["type"] == "checkout.session.completed":
        data = event["data"]["object"]
        user_id = int(data.get("metadata", {}).get("user_id", "0") or "0")
        if user_id:
            User.objects.filter(id=user_id).update(is_premium=True)
    return Response({"ok": True})
