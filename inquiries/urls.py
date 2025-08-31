"""
URL configuration for inquiries app
Task 12 - Lead capture and management endpoints
"""
from django.urls import path
from . import views_task12

app_name = 'inquiries'

urlpatterns = [
    # Task 12 - Inquiries (Lead Capture) endpoints
    path('inquiries/', views_task12.create_inquiry, name='create-inquiry'),
    path('inquiries/list/', views_task12.list_inquiries, name='list-inquiries'),
    path('inquiries/<int:inquiry_id>/', views_task12.get_inquiry_details, name='get-inquiry-details'),
]