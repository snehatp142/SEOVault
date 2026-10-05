from django.db import models
from websites.models import Website

class Keyword(models.Model):
    website = models.ForeignKey(
        Website,
        on_delete=models.CASCADE,
        
    null=True,
    blank=True
    )
    keyword = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.keyword
