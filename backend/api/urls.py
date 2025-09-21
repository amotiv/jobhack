from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import health, register, upgrade, resume_upload, jobs_list, job_detail, create_checkout, stripe_webhook

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),

    # Auth
    path("api/auth/register/", register),
    path("api/auth/login/", TokenObtainPairView.as_view()),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
    path("api/upgrade/", upgrade),

    # Resumes
    path("api/resumes/upload/", resume_upload),

    # Jobs
    path("api/jobs/", jobs_list),
    path("api/jobs/<int:pk>/", job_detail),

    # Billing
    path("api/billing/checkout-session/", create_checkout),
    path("api/billing/webhook/", stripe_webhook),
]
