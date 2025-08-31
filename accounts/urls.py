"""
URL configuration for accounts app
Task 1 - OTP Auth endpoints
"""
from django.urls import path
from . import views_task1

app_name = 'accounts'

urlpatterns = [
    # Task 1 - OTP Authentication endpoints  
    path('auth/request-otp/', views_task1.request_otp, name='request-otp'),
    path('auth/verify-otp/', views_task1.verify_otp, name='verify-otp'),
]