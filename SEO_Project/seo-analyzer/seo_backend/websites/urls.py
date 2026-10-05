from rest_framework.routers import DefaultRouter
from websites.views import WebsiteViewSet, PageViewSet

router = DefaultRouter()
router.register('websites', WebsiteViewSet, basename='websites')
# router.register('pages', PageViewSet, basename='pages')

urlpatterns = router.urls
