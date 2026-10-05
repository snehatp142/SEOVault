from django.urls import path
from .views import track_performance, performance_history

urlpatterns = [
    path("performance/track/", track_performance),
    path("performance/<int:website_id>/", performance_history),
]
