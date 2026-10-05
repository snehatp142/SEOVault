from django.db import models
from websites.models import Website

class Backlink(models.Model):
    website = models.ForeignKey(
        Website,
        on_delete=models.CASCADE,
        related_name="backlinks"
    )
    url = models.URLField()
    status = models.CharField(
        max_length=20,
        choices=[
            ("valid", "Valid"),
            ("broken", "Broken")
        ]
    )
    checked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
