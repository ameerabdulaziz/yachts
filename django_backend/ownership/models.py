"""
Task 4 - Owner Booking (Write + Rules v1) Models
Fractional ownership and booking rules models
"""
from django.db import models
from django.contrib.auth import get_user_model
from boats.models import Boat
from decimal import Decimal

User = get_user_model()

class FractionalOwnership(models.Model):
    """
    Fractional ownership records - Task 4
    Tracks yacht co-ownership shares and usage limits
    """
    
    SHARE_TYPE_CHOICES = [
        ('1/8', '1/8 Share (6 weeks/year)'),
        ('1/4', '1/4 Share (12 weeks/year)'),
        ('1/2', '1/2 Share (26 weeks/year)'),
        ('full', 'Full Ownership'),
    ]
    
    # Ownership details
    boat = models.ForeignKey(Boat, on_delete=models.CASCADE, related_name='ownerships')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='yacht_ownerships')
    
    # Share information
    share_percentage = models.CharField(max_length=10, choices=SHARE_TYPE_CHOICES)
    purchase_date = models.DateField()
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Usage limits (Yachtak spec: 48 days/50 engine hours per share)
    annual_day_limit = models.PositiveIntegerField(default=48, help_text="Days per year allowed")
    annual_hour_limit = models.PositiveIntegerField(default=50, help_text="Engine hours per year")
    
    # Current year usage tracking
    current_year_days_used = models.PositiveIntegerField(default=0)
    current_year_hours_used = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ownership_fractional_ownership'
        unique_together = ['boat', 'owner']
        verbose_name = 'Fractional Ownership'
        verbose_name_plural = 'Fractional Ownerships'
    
    def __str__(self):
        return f"{self.owner.phone} - {self.boat.model} ({self.share_percentage})"
    
    @property
    def remaining_days(self):
        """Calculate remaining days for current year"""
        return max(0, self.annual_day_limit - self.current_year_days_used)
    
    @property
    def remaining_hours(self):
        """Calculate remaining engine hours for current year"""
        return max(Decimal('0.00'), Decimal(str(self.annual_hour_limit)) - self.current_year_hours_used)

class BookingRule(models.Model):
    """
    Booking rules and restrictions - Task 4
    Implements Yachtak's sophisticated booking rules
    """
    
    RULE_TYPE_CHOICES = [
        ('seasonal_multiplier', 'Seasonal Rate Multiplier'),
        ('advance_booking', 'Advance Booking Requirement'),
        ('minimum_stay', 'Minimum Stay Requirement'),
        ('blackout_period', 'Blackout Period'),
        ('owner_priority', 'Owner Priority Period'),
    ]
    
    boat = models.ForeignKey(Boat, on_delete=models.CASCADE, related_name='booking_rules')
    rule_type = models.CharField(max_length=30, choices=RULE_TYPE_CHOICES)
    
    # Rule parameters
    rule_name = models.CharField(max_length=100)
    rule_description = models.TextField(blank=True)
    
    # Date applicability
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Rule values
    multiplier_value = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, help_text="Rate multiplier (e.g., 1.5 for 50% increase)")
    days_requirement = models.PositiveIntegerField(null=True, blank=True, help_text="Days for advance booking or minimum stay")
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ownership_booking_rule'
        verbose_name = 'Booking Rule'
        verbose_name_plural = 'Booking Rules'
    
    def __str__(self):
        return f"{self.boat.model} - {self.rule_name}"

class FuelWallet(models.Model):
    """
    Fuel wallet for yacht usage tracking - Task 4 prep
    Prepaid virtual fuel management system
    """
    
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='fuel_wallet')
    
    # Wallet balance
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), help_text="Current fuel credit balance")
    total_purchased = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), help_text="Total fuel credits purchased")
    total_consumed = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), help_text="Total fuel credits consumed")
    
    # Notifications
    low_balance_threshold = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('100.00'), help_text="Alert when balance drops below this amount")
    auto_topup_enabled = models.BooleanField(default=False)
    auto_topup_amount = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('500.00'))
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ownership_fuel_wallet'
        verbose_name = 'Fuel Wallet'
        verbose_name_plural = 'Fuel Wallets'
    
    def __str__(self):
        return f"Fuel Wallet - {self.owner.phone} (${self.current_balance})"
    
    @property
    def is_low_balance(self):
        """Check if balance is below threshold"""
        return self.current_balance < self.low_balance_threshold