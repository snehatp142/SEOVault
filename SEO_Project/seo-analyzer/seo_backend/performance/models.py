from django.db import models

# Create your models here.
from django.db import models
from websites.models import Website

class Performance(models.Model):
    website = models.ForeignKey(
        Website,
        on_delete=models.CASCADE,
        related_name="performance"
    )
    page_speed = models.FloatField(help_text="Seconds")
    seo_score = models.IntegerField()
    status = models.CharField(
        max_length=20,
        choices=[
            ("good", "Good"),
            ("average", "Average"),
            ("poor", "Poor")
        ]
    )
    checked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.website.url} - {self.seo_score}"
