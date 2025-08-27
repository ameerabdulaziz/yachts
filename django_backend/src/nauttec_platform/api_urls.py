from django.urls import path, include
from rest_framework.routers import DefaultRouter
from yachts.views import YachtViewSet
from accounts.views import UserViewSet

# Create router for API endpoints
router = DefaultRouter()
router.register(r'yachts', YachtViewSet, basename='yachts')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('api/', include(router.urls)),
    path('', include(router.urls)),  # Also allow without /api/ prefix
]