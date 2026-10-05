from django.urls import path
from seo_audit.views import analyze_seo
from seo_audit.views import  seo_audit_history

urlpatterns = [
    path("seo-analyze/", analyze_seo,name="seo-analyze"),
     path("seo-history/<int:website_id>/", seo_audit_history),
]
