"""
Booking Models for Nauttec Yacht Platform
Charter reservations and fractional ownership usage
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from datetime import timedelta

User = get_user_model()

class Booking(models.Model):
    """
    Yacht charter booking with guest management and pricing
    """
    
    BOOKING_STATUS = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
    ]
    
    PAYMENT_STATUS = [
        ('pending', 'Payment Pending'),
        ('partial', 'Partially Paid'),
        ('paid', 'Fully Paid'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    yacht = models.ForeignKey('yachts.Yacht', on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    
    # Booking details
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    guest_count = models.IntegerField(validators=[MinValueValidator(1)])
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    
    # Additional services
    add_ons = models.JSONField(default=dict, help_text="Captain, catering, equipment, etc.")
    special_requests = models.TextField(blank=True)
    
    # Payment information
    payment_method = models.CharField(max_length=50, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)
    
    # Fuel usage tracking (for owners)
    estimated_fuel_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    actual_fuel_used = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.yacht.name} - {self.user.full_name} ({self.start_date.date()})"
    
    @property
    def duration_days(self):
        return (self.end_date - self.start_date).days
    
    @property
    def is_owner_booking(self):
        """Check if this is an owner using their yacht shares"""
        return self.user.is_owner and self.yacht in [
            share.opportunity.yacht for share in self.user.get_owned_shares()
        ]
    
    def calculate_total_price(self):
        """Calculate total price including add-ons and seasonal rates"""
        base_price = self.yacht.get_current_price(self.start_date.date()) * self.duration_days
        
        # Add-on costs
        addon_costs = 0
        if self.add_ons.get('captain'):
            addon_costs += 150 * self.duration_days  # Captain fee per day
        if self.add_ons.get('catering'):
            addon_costs += 50 * self.guest_count * self.duration_days  # Catering per person per day
        
        return base_price + addon_costs
    
    def can_cancel(self):
        """Check if booking can be cancelled (48h before start)"""
        from django.utils import timezone
        return timezone.now() < (self.start_date - timedelta(hours=48))

class BookingGuest(models.Model):
    """
    Guest information for yacht bookings
    """
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='guests')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    age = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(120)])
    dietary_requirements = models.CharField(max_length=200, blank=True)
    
    class Meta:
        db_table = 'booking_guests'
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class BookingPayment(models.Model):
    """
    Payment tracking for yacht bookings
    """
    
    PAYMENT_TYPES = [
        ('deposit', 'Deposit'),
        ('balance', 'Balance Payment'),
        ('full', 'Full Payment'),
        ('refund', 'Refund'),
    ]
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100, unique=True)
    
    # Payment gateway details
    gateway_response = models.JSONField(default=dict)
    is_successful = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_payments'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.booking.yacht.name} - {self.amount} ({self.payment_type})"

class BookingReview(models.Model):
    """
    Guest reviews and ratings for yacht experiences
    """
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='review')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=100)
    comment = models.TextField()
    
    # Detailed ratings
    yacht_condition = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    crew_service = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True)
    value_for_money = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    # Review management
    is_published = models.BooleanField(default=True)
    admin_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_reviews'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.booking.yacht.name} Review - {self.rating}/5 stars"