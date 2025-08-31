
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from .health_views import health_check, database_health, test_all_systems, api_status

def healthz(request):
    """Health check endpoint - Task 15 requirement"""
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('healthz/', healthz, name='healthz'),
    # Task 1 - OTP Auth endpoints
    path('', include('accounts.urls')),
    # Task 2 - Boats API endpoints
    path('', include('boats.urls')),
    # Task 3-5 - Bookings/Calendar endpoints
    path('', include('bookings.urls')),
    # Task 4 - Ownership endpoints (commented out due to missing urls.py)
    # path('', include('ownership.urls')),
    # Tasks 6-10 - Payment processing endpoints
    path('', include('payment_system.urls')),
    # Task 12 - Lead capture and management endpoints
    path('', include('inquiries.urls')),
    # Task 13 - Notifications and in-app feed endpoints
    path('', include('notify_system.urls')),
    
    # Task 15 - Health check endpoints
    path('health/', health_check, name='health_check'),
    path('health/database/', database_health, name='database_health'),
    path('health/test-systems/', test_all_systems, name='test_all_systems'),
    path('health/api/', api_status, name='api_status'),
]
