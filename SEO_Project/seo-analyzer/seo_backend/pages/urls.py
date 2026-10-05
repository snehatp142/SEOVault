from rest_framework.routers import DefaultRouter
from pages.views import PageViewSet, fetch_pages
from django.urls import path

router = DefaultRouter()
router.register('pages', PageViewSet, basename='pages')

urlpatterns = [
    path('pages/fetch/', fetch_pages, name='fetch-pages'),
]

# ✅ ADD router urls (not override)
urlpatterns += router.urls