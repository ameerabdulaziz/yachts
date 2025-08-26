"""
Main URL configuration for Nauttec Yacht Platform
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls

# Import viewsets
from yachts.views import YachtViewSet
# from bookings.views import BookingViewSet
# from ownership.views import OwnershipOpportunityViewSet, ShareTransferViewSet

# API Router
router = DefaultRouter()
router.register(r'yachts', YachtViewSet, basename='yacht')
# router.register(r'bookings', BookingViewSet, basename='booking')
# router.register(r'ownership', OwnershipOpportunityViewSet, basename='ownership')
# router.register(r'shares', ShareTransferViewSet, basename='shares')

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/', include(router.urls)),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    
    # Social authentication
    path('accounts/', include('allauth.urls')),
    
    # API documentation
    path('api/docs/', include_docs_urls(title='Nauttec Yacht Platform API')),
    
    # Health check
    path('health/', lambda request: HttpResponse('OK')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "Nauttec Yacht Platform Administration"
admin.site.site_title = "Nauttec Admin"
admin.site.index_title = "Welcome to Nauttec Administration"