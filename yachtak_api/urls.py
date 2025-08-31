
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
    # Task 3 - Bookings/Calendar endpoints
    path('', include('bookings.urls')),
]
