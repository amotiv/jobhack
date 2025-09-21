from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Simple health check endpoint
    """
    return JsonResponse({
        "status": "healthy",
        "message": "Django server is running",
        "timestamp": "2025-08-29T20:52:00Z"
    })

