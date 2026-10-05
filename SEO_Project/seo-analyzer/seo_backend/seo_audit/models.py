from django.db import models
from websites.models import Website
from pages.models import Page   # ✅ ADD THIS

class SEOAudit(models.Model):
    website = models.ForeignKey(
        Website,
        on_delete=models.CASCADE,
        related_name="seo_audits"
    )

    page = models.ForeignKey(          # ✅ NEW
        Page,
        on_delete=models.CASCADE,
        related_name="seo_audits",
        null=True,
        blank=True
    )

    # SEO Data
    title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    # SEO Checks
    has_h1 = models.BooleanField(default=False)
    total_images = models.IntegerField(default=0)
    images_missing_alt = models.IntegerField(default=0)

    # Technical status
    is_accessible = models.BooleanField(default=True)
    cloudflare_blocked = models.BooleanField(default=False)

    # SEO score
    seo_score = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SEO Audit - {self.website.domain} - {self.page.url if self.page else 'Website'}"
