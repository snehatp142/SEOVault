from django.urls import path
from  backlinks.views import scan_backlinks, list_backlinks

urlpatterns = [
    path("backlinks/scan/", scan_backlinks),
    path("backlinks/<int:website_id>/", list_backlinks),
]
