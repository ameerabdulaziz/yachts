"""
URL configuration for accounts app
Task 1 - OTP Auth endpoints
"""
from django.urls import path
from . import views_task1

app_name = 'accounts'

urlpatterns = [
    # Task 1 - Complete Authentication Flow
    path('auth/register/', views_task1.register_user, name='register'),
    path('auth/send-otp/', views_task1.send_otp, name='send-otp'),
    path('auth/verify-otp/', views_task1.verify_otp, name='verify-otp'),
    path('auth/set-password/', views_task1.set_password, name='set-password'),
    path('auth/login/', views_task1.user_login, name='login'),
    path('auth/profile/', views_task1.get_profile, name='profile'),
    
    # Legacy endpoints for compatibility
    path('auth/request-otp/', views_task1.send_otp, name='request-otp'),
]