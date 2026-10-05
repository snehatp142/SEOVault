from django.urls import path
from keywords.views import add_keyword, list_keywords, suggest_keywords

urlpatterns = [
    path("keywords/add/", add_keyword),
    path("keywords/<int:website_id>/", list_keywords),
    path("keywords/suggest/", suggest_keywords),
]
