from django.db import models
from websites.models import Website

class Report(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE)
    report_type = models.CharField(max_length=100, default="seo")  # PDF / CSV
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
