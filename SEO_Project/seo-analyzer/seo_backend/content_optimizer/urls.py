from django.urls import path
from content_optimizer.views import generate_suggestion, edit_suggestion, approve_and_apply
from content_optimizer.views import approve_optimization
urlpatterns = [
    path("content/generate/", generate_suggestion),
    path("content/edit/<int:opt_id>/", edit_suggestion),
    path("content/apply/<int:opt_id>/", approve_and_apply),
    path("content/approve/",approve_optimization)
]
