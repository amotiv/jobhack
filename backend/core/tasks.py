from typing import List
from celery import shared_task
from django.contrib.auth import get_user_model
from .models import Resume, JobListing, MatchScore
from .scoring import extract_text_from_upload, keyword_score

User = get_user_model()

@shared_task
def parse_resume_if_needed(resume_id: int):
    """Ensure resume.text is populated by parsing the file (idempotent)."""
    try:
        res = Resume.objects.get(id=resume_id)
    except Resume.DoesNotExist:
        return
    if res.text:
        return
    # file path (works for local; with S3, storage may not expose path — download temp)
    path = getattr(res.file, "path", None)
    if not path:
        import tempfile
        tmp = tempfile.NamedTemporaryFile(delete=False)
        for chunk in res.file.chunks():
            tmp.write(chunk)
        tmp.close()
        path = tmp.name
    text = extract_text_from_upload(path, res.file_format or "pdf")
    res.text = (text or "")[:200000]
    res.save(update_fields=["text"])

@shared_task
def compute_match_scores_for_user(user_id: int):
    """Precompute MatchScore for all jobs for a user (uses latest resume)."""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return
    resume = Resume.objects.filter(user=user).order_by("-uploaded_at").first()
    if not resume:
        return
    if not resume.text:
        parse_resume_if_needed(resume.id)

    rt = (resume.text or "").lower()
    jobs: List[JobListing] = list(JobListing.objects.all().only("id","title","keywords"))
    for job in jobs:
        score = keyword_score(rt, job.title, job.keywords or [])
        obj, _ = MatchScore.objects.get_or_create(user=user, job=job, defaults={"score_percentage": score})
        if obj.score_percentage != score:
            obj.score_percentage = score
            obj.save(update_fields=["score_percentage"])

@shared_task
def compute_match_scores_for_job(job_id: int):
    """When a new job is created, precompute for all users who have a resume."""
    try:
        job = JobListing.objects.get(id=job_id)
    except JobListing.DoesNotExist:
        return
    resumes = Resume.objects.select_related("user").order_by("-uploaded_at").distinct("user")
    for res in resumes:
        if not res.text:
            parse_resume_if_needed(res.id)
        rt = (res.text or "").lower()
        score = keyword_score(rt, job.title, job.keywords or [])
        obj, _ = MatchScore.objects.get_or_create(user=res.user, job=job, defaults={"score_percentage": score})
        if obj.score_percentage != score:
            obj.score_percentage = score
            obj.save(update_fields=["score_percentage"])

