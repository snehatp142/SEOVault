from django.db import models

# Create your models here.
# websites/models.py
from django.db import models
from accounts.models import User

class Website(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    domain = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

class Page(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE)
    url = models.URLField()
    last_checked = models.DateTimeField(null=True)
