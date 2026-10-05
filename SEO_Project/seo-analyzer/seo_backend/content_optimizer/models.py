# from django.db import models

# Create your models here.
from django.db import models
from websites.models import Website
from pages.models import Page
from django.contrib.auth import get_user_model

User = get_user_model()

class ContentOptimization(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)

    original_title = models.TextField()
    original_meta = models.TextField()
    original_content = models.TextField()

    suggested_title = models.TextField()
    suggested_meta = models.TextField()
    suggested_content = models.TextField()

    final_title = models.TextField(blank=True, null=True)
    final_meta = models.TextField(blank=True, null=True)
    final_content = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("generated", "Generated"),
            ("edited", "Edited"),
            ("approved", "Approved"),
            ("applied", "Applied")
        ],
        default="generated"
    )

    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
