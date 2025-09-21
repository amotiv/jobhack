from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JobListing
from .tasks import compute_match_scores_for_job

@receiver(post_save, sender=JobListing)
def _job_saved(sender, instance, created, **kwargs):
    if created:
        compute_match_scores_for_job.delay(instance.id)

