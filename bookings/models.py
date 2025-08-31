"""
Task 3 - Owner Calendar Models
Booking and calendar models for yacht reservations
"""
from django.db import models
from django.contrib.auth import get_user_model
from boats.models import Boat

User = get_user_model()

class Booking(models.Model):
    """
    Booking model for yacht reservations - Task 3
    Handles both owner bookings and rental bookings
    """
    
    BOOKING_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    BOOKING_TYPE_CHOICES = [
        ('owner', 'Owner Booking'),
        ('rental', 'Rental Booking'),
    ]
    
    # Core booking information
    boat = models.ForeignKey(Boat, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    
    # Booking details
    booking_type = models.CharField(max_length=10, choices=BOOKING_TYPE_CHOICES, default='rental')
    status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default='pending')
    
    # Date and time
    start_date = models.DateField(help_text="Booking start date")
    end_date = models.DateField(help_text="Booking end date")
    start_time = models.TimeField(null=True, blank=True, help_text="Departure time")
    end_time = models.TimeField(null=True, blank=True, help_text="Return time")
    
    # Guests and pricing
    guest_count = models.PositiveIntegerField(default=1, help_text="Number of guests")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Additional information
    notes = models.TextField(blank=True, help_text="Booking notes or special requests")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings_booking'
        ordering = ['-start_date', '-start_time']
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
    
    def __str__(self):
        return f"{self.boat.model} - {self.user.phone} ({self.start_date})"
    
    @property
    def duration_days(self):
        """Calculate booking duration in days"""
        return (self.end_date - self.start_date).days + 1

class CalendarEvent(models.Model):
    """
    Calendar events for boat availability - Task 3
    Includes bookings, maintenance, and blocked dates
    """
    
    EVENT_TYPE_CHOICES = [
        ('booking', 'Booking'),
        ('maintenance', 'Maintenance'),
        ('blocked', 'Blocked'),
        ('available', 'Available'),
    ]
    
    boat = models.ForeignKey(Boat, on_delete=models.CASCADE, related_name='calendar_events')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True, related_name='calendar_events')
    
    # Event details
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    title = models.CharField(max_length=200, help_text="Event title")
    description = models.TextField(blank=True)
    
    # Date and time
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings_calendar_event'
        ordering = ['start_date', 'start_time']
        verbose_name = 'Calendar Event'
        verbose_name_plural = 'Calendar Events'
    
    def __str__(self):
        return f"{self.boat.model} - {self.title} ({self.start_date})"