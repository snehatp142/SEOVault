from django.db import models

# Create your models here.
from django.db import models
from websites.models import Website
from django.contrib.auth import get_user_model

User = get_user_model()

class TeamMember(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=10,
        choices=[
            ("admin", "Admin"),
            ("editor", "Editor"),
            ("viewer", "Viewer")
        ]
    )

class CollaborationNote(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
