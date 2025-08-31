
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

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
    # Tasks 6-10 - Payment processing endpoints
    path('', include('payment_system.urls')),
    # Task 12 - Lead capture and management endpoints
    path('', include('inquiries.urls')),
]
