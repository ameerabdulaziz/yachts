"""
Task 13 - Notifications (In-App Feed) Models
Real-time notification system for yacht platform users
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils import timezone
from decimal import Decimal

User = get_user_model()

class Notification(models.Model):
    """
    In-app notifications for yacht platform users - Task 13
    Handles booking updates, payment confirmations, system alerts
    """
    
    NOTIFICATION_TYPES = [
        ('booking_confirmed', 'Booking Confirmed'),
        ('booking_cancelled', 'Booking Cancelled'),
        ('booking_reminder', 'Booking Reminder'),
        ('payment_successful', 'Payment Successful'),
        ('payment_failed', 'Payment Failed'),
        ('fuel_low_balance', 'Fuel Wallet Low Balance'),
        ('fuel_purchase_confirmed', 'Fuel Purchase Confirmed'),
        ('ownership_share_available', 'Ownership Share Available'),
        ('inquiry_received', 'New Inquiry Received'),
        ('inquiry_update', 'Inquiry Status Update'),
        ('system_maintenance', 'System Maintenance Alert'),
        ('welcome_message', 'Welcome Message'),
        ('security_alert', 'Security Alert'),
        ('promotional', 'Promotional Message'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low Priority'),
        ('medium', 'Medium Priority'),
        ('high', 'High Priority'),
        ('urgent', 'Urgent'),
    ]
    
    # Recipient
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    
    # Notification content
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    
    # Action link (optional)
    action_url = models.URLField(blank=True, help_text="Deep link for mobile app or web URL")
    action_text = models.CharField(max_length=50, blank=True, help_text="Button text like 'View Booking'")
    
    # Related object (generic relation)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object = GenericForeignKey('content_type', 'object_id')
    
    # Status tracking
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Delivery channels
    sent_push = models.BooleanField(default=False, help_text="Sent as push notification")
    sent_email = models.BooleanField(default=False, help_text="Sent as email")
    sent_sms = models.BooleanField(default=False, help_text="Sent as SMS")
    
    # Scheduling
    scheduled_for = models.DateTimeField(null=True, blank=True, help_text="Schedule notification for future delivery")
    expires_at = models.DateTimeField(null=True, blank=True, help_text="Notification expiration time")
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True, help_text="Additional notification data")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notify_system_notification'
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['scheduled_for']),
        ]
    
    def __str__(self):
        return f"{self.user.phone} - {self.title}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    @property
    def is_expired(self):
        """Check if notification has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False

class NotificationPreference(models.Model):
    """
    User notification preferences - Task 13
    Controls which notifications users want to receive and how
    """
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Channel preferences
    push_notifications_enabled = models.BooleanField(default=True)
    email_notifications_enabled = models.BooleanField(default=True)
    sms_notifications_enabled = models.BooleanField(default=False)
    
    # Notification type preferences
    booking_notifications = models.BooleanField(default=True)
    payment_notifications = models.BooleanField(default=True)
    fuel_notifications = models.BooleanField(default=True)
    ownership_notifications = models.BooleanField(default=True)
    inquiry_notifications = models.BooleanField(default=True)
    system_notifications = models.BooleanField(default=True)
    promotional_notifications = models.BooleanField(default=False)
    
    # Quiet hours
    quiet_hours_enabled = models.BooleanField(default=False)
    quiet_hours_start = models.TimeField(null=True, blank=True, help_text="Start of quiet hours (no notifications)")
    quiet_hours_end = models.TimeField(null=True, blank=True, help_text="End of quiet hours")
    
    # Frequency settings
    digest_frequency = models.CharField(
        max_length=10,
        choices=[
            ('immediate', 'Immediate'),
            ('hourly', 'Hourly Digest'),
            ('daily', 'Daily Digest'),
            ('weekly', 'Weekly Digest'),
        ],
        default='immediate'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notify_system_notification_preference'
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'
    
    def __str__(self):
        return f"{self.user.phone} - Notification Preferences"

class NotificationTemplate(models.Model):
    """
    Notification message templates - Task 13
    Standardized templates for different notification types
    """
    
    notification_type = models.CharField(max_length=30, choices=Notification.NOTIFICATION_TYPES, unique=True)
    title_template = models.CharField(max_length=200, help_text="Title template with placeholders like {yacht_name}")
    message_template = models.TextField(help_text="Message template with placeholders")
    
    # Template variables documentation
    available_variables = models.JSONField(
        default=list,
        help_text="List of available template variables like ['yacht_name', 'booking_date']"
    )
    
    # Default settings
    default_priority = models.CharField(max_length=10, choices=Notification.PRIORITY_LEVELS, default='medium')
    default_action_text = models.CharField(max_length=50, blank=True)
    
    # Delivery settings
    send_push = models.BooleanField(default=True)
    send_email = models.BooleanField(default=False)
    send_sms = models.BooleanField(default=False)
    
    # Template metadata
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True, help_text="Template description for admins")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notify_system_notification_template'
        verbose_name = 'Notification Template'
        verbose_name_plural = 'Notification Templates'
    
    def __str__(self):
        return f"Template: {self.get_notification_type_display()}"
    
    def render_title(self, context):
        """Render title with context variables"""
        return self.title_template.format(**context)
    
    def render_message(self, context):
        """Render message with context variables"""
        return self.message_template.format(**context)