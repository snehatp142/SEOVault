from django.db import models
from websites.models import Website

class Page(models.Model):
    website = models.ForeignKey(
        Website,
        on_delete=models.CASCADE,
        related_name="pages"
    )
    url = models.URLField()
    title = models.CharField(max_length=255)
    meta_description = models.TextField(blank=True)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
