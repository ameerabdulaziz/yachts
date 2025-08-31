"""
URL configuration for notify_system app
Task 13 - Notification management endpoints
"""
from django.urls import path
from . import views_task13

app_name = 'notify_system'

urlpatterns = [
    # Task 13 - Notifications (In-App Feed) endpoints
    path('notifications/', views_task13.get_user_notifications, name='get-user-notifications'),
    path('notifications/<int:notification_id>/mark-read/', views_task13.mark_notification_read, name='mark-notification-read'),
    path('notifications/test/', views_task13.create_test_notification, name='create-test-notification'),
    path('notifications/preferences/', views_task13.get_notification_preferences, name='get-notification-preferences'),
]