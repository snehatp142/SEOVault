from django.urls import path
from collaboration.views import add_team_member, add_note, list_notes

urlpatterns = [
    path("team/add/", add_team_member),
    path("notes/add/", add_note),
    path("notes/<int:website_id>/", list_notes),
]
