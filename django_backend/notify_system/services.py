"""
Task 13 - Notification Services
Business logic for creating and managing notifications
"""
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from .models import Notification, NotificationTemplate, NotificationPreference
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class NotificationService:
    """
    Core notification service for creating and managing notifications - Task 13
    """
    
    @staticmethod
    def create_notification(
        user, 
        notification_type, 
        title=None, 
        message=None, 
        related_object=None, 
        context=None,
        priority='medium',
        action_url='',
        action_text='',
        schedule_for=None,
        expires_at=None
    ):
        """
        Create a new notification for a user
        """
        try:
            context = context or {}
            
            # Get or create notification template
            template = None
            try:
                template = NotificationTemplate.objects.get(
                    notification_type=notification_type,
                    is_active=True
                )
            except NotificationTemplate.DoesNotExist:
                logger.warning(f"No template found for notification type: {notification_type}")
            
            # Use template if available and no custom title/message provided
            if template:
                final_title = title or template.render_title(context)
                final_message = message or template.render_message(context)
                final_priority = priority if priority != 'medium' else template.default_priority
                final_action_text = action_text or template.default_action_text
            else:
                final_title = title or f"New {notification_type.replace('_', ' ').title()}"
                final_message = message or "You have a new notification"
                final_priority = priority
                final_action_text = action_text
            
            # Set up related object if provided
            content_type = None
            object_id = None
            if related_object:
                content_type = ContentType.objects.get_for_model(related_object)
                object_id = related_object.pk
            
            # Create notification
            notification = Notification.objects.create(
                user=user,
                notification_type=notification_type,
                title=final_title,
                message=final_message,
                priority=final_priority,
                action_url=action_url,
                action_text=final_action_text,
                content_type=content_type,
                object_id=object_id,
                scheduled_for=schedule_for,
                expires_at=expires_at,
                metadata=context
            )
            
            logger.info(f"Notification created: {notification.id} for user {user.phone}")
            
            # Mark as delivered immediately for this implementation
            notification.sent_push = True
            notification.save(update_fields=['sent_push'])
            
            return notification
            
        except Exception as e:
            logger.error(f"Error creating notification: {e}")
            raise

    @staticmethod
    def get_user_preferences(user):
        """Get or create user notification preferences"""
        prefs, created = NotificationPreference.objects.get_or_create(
            user=user,
            defaults={
                'push_notifications_enabled': True,
                'email_notifications_enabled': True,
                'sms_notifications_enabled': False,
                'booking_notifications': True,
                'payment_notifications': True,
                'fuel_notifications': True,
                'ownership_notifications': True,
                'inquiry_notifications': True,
                'system_notifications': True,
                'promotional_notifications': False,
            }
        )
        return prefs

    @staticmethod
    def mark_notification_read(notification_id, user):
        """Mark a notification as read by user"""
        try:
            notification = Notification.objects.get(id=notification_id, user=user)
            if not notification.is_read:
                notification.is_read = True
                notification.read_at = timezone.now()
                notification.save(update_fields=['is_read', 'read_at'])
                
                logger.info(f"Notification {notification_id} marked as read by {user.phone}")
                return True
        except Notification.DoesNotExist:
            logger.warning(f"Notification {notification_id} not found for user {user.phone}")
        except Exception as e:
            logger.error(f"Error marking notification as read: {e}")
        
        return False

    @staticmethod
    def get_user_notifications(user, unread_only=False, limit=50):
        """Get notifications for a user"""
        queryset = Notification.objects.filter(user=user)
        
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        # Exclude expired notifications
        queryset = queryset.exclude(
            expires_at__isnull=False,
            expires_at__lt=timezone.now()
        )
        
        return queryset.order_by('-created_at')[:limit]

    @staticmethod
    def get_notification_count(user, unread_only=True):
        """Get notification count for user"""
        queryset = Notification.objects.filter(user=user)
        
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        # Exclude expired notifications
        queryset = queryset.exclude(
            expires_at__isnull=False,
            expires_at__lt=timezone.now()
        )
        
        return queryset.count()