
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

def healthz(request):
    """Health check endpoint - Task 15 requirement"""
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('healthz/', healthz, name='healthz'),
]
