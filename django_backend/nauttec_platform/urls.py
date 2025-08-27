"""
URL configuration for Nauttec Platform project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

# Admin site customization
admin.site.site_header = "Nauttec Platform Administration"
admin.site.site_title = "Nauttec Admin Portal"
admin.site.index_title = "Yacht Platform Management"

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API Schema and Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API v1 endpoints
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/yachts/', include('yachts.urls')),
    path('api/v1/bookings/', include('bookings.urls')),
    path('api/v1/ownership/', include('ownership.urls')),
    path('api/v1/shares/', include('shares.urls')),
    path('api/v1/messaging/', include('messaging.urls')),
    path('api/v1/fuel-wallet/', include('fuel_wallet.urls')),
    
    # Health check endpoint
    path('health/', lambda request: HttpResponse('OK')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Import HttpResponse for health check
from django.http import HttpResponse