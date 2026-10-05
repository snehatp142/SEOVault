from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
class User(AbstractUser):
    ROLE_CHOICES=(
        ('superadmin', 'Super Admin'),
        ('admin', 'Admin'),
        ('editor', 'Editor'),
        
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
