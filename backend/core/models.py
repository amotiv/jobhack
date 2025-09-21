from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
    is_premium = models.BooleanField(default=False)
    email = models.EmailField(unique=True)

class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file = models.FileField(upload_to="resumes/")
    file_format = models.CharField(max_length=16, blank=True)
    text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class JobListing(models.Model):
    title = models.CharField(max_length=200, db_index=True)
    company = models.CharField(max_length=200, db_index=True)
    location = models.CharField(max_length=200, db_index=True)
    description = models.TextField()
    keywords = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class MatchScore(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    score_percentage = models.PositiveSmallIntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("user", "job"),)
        indexes = [models.Index(fields=["user", "job"])]
