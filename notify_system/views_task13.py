"""
Task 13 - Notifications (In-App Feed) Views
API endpoints for notification management and user feed
"""
import json
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Notification, NotificationPreference, NotificationTemplate
from .services import NotificationService
from boats.models import Boat
from bookings.models import Booking
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@require_http_methods(["GET"])
def get_user_notifications(request):
    """
    Get user's notification feed
    GET /notifications/?user_phone=+201234567890&unread_only=true&limit=20
    """
    try:
        user_phone = request.GET.get('user_phone', '+201234567890')
        unread_only = request.GET.get('unread_only', 'false').lower() == 'true'
        limit = int(request.GET.get('limit', 20))
        
        # Get user
        try:
            user = User.objects.get(phone=user_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Get notifications
        notifications = NotificationService.get_user_notifications(
            user=user,
            unread_only=unread_only,
            limit=limit
        )
        
        # Format notifications
        notifications_data = []
        for notification in notifications:
            notifications_data.append({
                'id': notification.id,
                'type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'priority': notification.priority,
                'action_url': notification.action_url,
                'action_text': notification.action_text,
                'is_read': notification.is_read,
                'is_archived': notification.is_archived,
                'related_object_info': _get_related_object_info(notification),
                'read_at': notification.read_at.isoformat() if notification.read_at else None,
                'created_at': notification.created_at.isoformat(),
                'expires_at': notification.expires_at.isoformat() if notification.expires_at else None,
                'metadata': notification.metadata,
            })
        
        # Get notification counts
        total_count = NotificationService.get_notification_count(user, unread_only=False)
        unread_count = NotificationService.get_notification_count(user, unread_only=True)
        
        return JsonResponse({
            'success': True,
            'notifications': notifications_data,
            'count': len(notifications_data),
            'total_count': total_count,
            'unread_count': unread_count,
            'has_more': len(notifications_data) == limit and total_count > limit,
        })
        
    except ValueError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid limit parameter'
        }, status=400)
    except Exception as e:
        logger.error(f"Error getting user notifications: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to get notifications'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def mark_notification_read(request, notification_id):
    """
    Mark a notification as read
    POST /notifications/{id}/mark-read/
    Body: {"user_phone": "+201234567890"}
    """
    try:
        data = json.loads(request.body)
        user_phone = data.get('user_phone', '+201234567890')
        
        # Get user
        try:
            user = User.objects.get(phone=user_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Mark notification as read
        success = NotificationService.mark_notification_read(notification_id, user)
        
        if success:
            return JsonResponse({
                'success': True,
                'message': 'Notification marked as read'
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Notification not found or already read'
            }, status=404)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error marking notification as read: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to mark notification as read'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def create_test_notification(request):
    """
    Create test notification for development/testing
    POST /notifications/test/
    Body: {
        "user_phone": "+201234567890",
        "notification_type": "booking_confirmed",
        "title": "Test Notification",
        "message": "This is a test notification",
        "priority": "high"
    }
    """
    try:
        data = json.loads(request.body)
        user_phone = data.get('user_phone', '+201234567890')
        notification_type = data.get('notification_type', 'system_maintenance')
        title = data.get('title', 'Test Notification')
        message = data.get('message', 'This is a test notification')
        priority = data.get('priority', 'medium')
        
        # Get user
        try:
            user = User.objects.get(phone=user_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Create notification
        notification = NotificationService.create_notification(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            priority=priority,
            context=data.get('context', {})
        )
        
        return JsonResponse({
            'success': True,
            'notification': {
                'id': notification.id,
                'type': notification.notification_type,
                'title': notification.title,
                'message': notification.message,
                'priority': notification.priority,
                'created_at': notification.created_at.isoformat(),
            },
            'message': 'Test notification created successfully'
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating test notification: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to create test notification'
        }, status=500)

@require_http_methods(["GET"])
def get_notification_preferences(request):
    """
    Get user notification preferences
    GET /notifications/preferences/?user_phone=+201234567890
    """
    try:
        user_phone = request.GET.get('user_phone', '+201234567890')
        
        # Get user
        try:
            user = User.objects.get(phone=user_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Get preferences
        prefs = NotificationService.get_user_preferences(user)
        
        return JsonResponse({
            'success': True,
            'preferences': {
                'push_notifications_enabled': prefs.push_notifications_enabled,
                'email_notifications_enabled': prefs.email_notifications_enabled,
                'sms_notifications_enabled': prefs.sms_notifications_enabled,
                'booking_notifications': prefs.booking_notifications,
                'payment_notifications': prefs.payment_notifications,
                'fuel_notifications': prefs.fuel_notifications,
                'ownership_notifications': prefs.ownership_notifications,
                'inquiry_notifications': prefs.inquiry_notifications,
                'system_notifications': prefs.system_notifications,
                'promotional_notifications': prefs.promotional_notifications,
                'quiet_hours_enabled': prefs.quiet_hours_enabled,
                'quiet_hours_start': prefs.quiet_hours_start.strftime('%H:%M') if prefs.quiet_hours_start else None,
                'quiet_hours_end': prefs.quiet_hours_end.strftime('%H:%M') if prefs.quiet_hours_end else None,
                'digest_frequency': prefs.digest_frequency,
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting notification preferences: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to get notification preferences'
        }, status=500)

def _get_related_object_info(notification):
    """Get information about related object for notification display"""
    if not notification.related_object:
        return None
    
    try:
        obj = notification.related_object
        
        # Handle different related object types
        if isinstance(obj, Booking):
            return {
                'type': 'booking',
                'id': obj.id,
                'boat_name': obj.boat.name,
                'boat_model': obj.boat.model,
                'start_date': obj.start_date.isoformat(),
                'end_date': obj.end_date.isoformat(),
                'status': obj.status,
            }
        elif isinstance(obj, Boat):
            return {
                'type': 'boat',
                'id': obj.id,
                'name': obj.name,
                'model': obj.model,
                'location': obj.location,
            }
        else:
            return {
                'type': obj.__class__.__name__.lower(),
                'id': obj.id if hasattr(obj, 'id') else None,
            }
    except Exception as e:
        logger.warning(f"Error getting related object info: {e}")
        return None