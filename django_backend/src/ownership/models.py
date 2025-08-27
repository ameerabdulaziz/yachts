"""
Ownership Models for Nauttec Yacht Platform
Fractional yacht ownership with 48-day/50-hour usage limits
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from decimal import Decimal

User = get_user_model()

class OwnershipOpportunity(models.Model):
    """
    Fractional yacht ownership opportunities with share structures
    """
    
    SHARE_FRACTIONS = [
        ('1/8', '1/8 Share (48 days)'),
        ('1/6', '1/6 Share (60 days)'),
        ('1/4', '1/4 Share (90 days)'),
        ('1/3', '1/3 Share (120 days)'),
        ('1/2', '1/2 Share (180 days)'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    yacht = models.ForeignKey('yachts.Yacht', on_delete=models.CASCADE, related_name='ownership_opportunities')
    
    # Share structure
    share_fraction = models.CharField(max_length=10, choices=SHARE_FRACTIONS)
    share_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_shares = models.IntegerField(validators=[MinValueValidator(1)])
    available_shares = models.IntegerField(validators=[MinValueValidator(0)])
    
    # Usage limits
    usage_days_per_year = models.IntegerField(help_text="Annual usage days per share")
    usage_hours_per_year = models.IntegerField(default=50, help_text="Annual engine hours per share")
    
    # Financing options
    financing_available = models.BooleanField(default=True)
    down_payment_percent = models.DecimalField(max_digits=5, decimal_places=2, default=20.00)
    financing_term_months = models.IntegerField(default=60)
    monthly_payment = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Additional costs
    monthly_maintenance_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    insurance_fee_annual = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    mooring_fee_annual = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    
    # Opportunity status
    is_active = models.BooleanField(default=True)
    launch_date = models.DateTimeField()
    closing_date = models.DateTimeField(null=True, blank=True)
    
    # Marketing
    marketing_headline = models.CharField(max_length=200)
    marketing_description = models.TextField()
    key_benefits = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ownership_opportunities'
        ordering = ['yacht__model', '-share_price']
        
    def __str__(self):
        return f"{self.yacht.name} - {self.share_fraction} Share"
    
    @property
    def is_sold_out(self):
        return self.available_shares == 0
    
    @property
    def completion_percentage(self):
        if self.total_shares == 0:
            return 0
        sold_shares = self.total_shares - self.available_shares
        return (sold_shares / self.total_shares) * 100
    
    def calculate_monthly_payment(self):
        """Calculate monthly financing payment"""
        if not self.financing_available:
            return 0
        
        principal = self.share_price * (1 - self.down_payment_percent / 100)
        monthly_rate = 0.05 / 12  # 5% annual rate
        num_payments = self.financing_term_months
        
        if monthly_rate == 0:
            return principal / num_payments
        
        monthly_payment = principal * (monthly_rate * (1 + monthly_rate) ** num_payments) / \
                         ((1 + monthly_rate) ** num_payments - 1)
        
        return round(monthly_payment, 2)

class SharePurchase(models.Model):
    """
    Individual yacht share purchases by users
    """
    
    PURCHASE_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    opportunity = models.ForeignKey(OwnershipOpportunity, on_delete=models.CASCADE, related_name='purchases')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='share_purchases')
    
    # Purchase details
    shares_purchased = models.IntegerField(validators=[MinValueValidator(1)])
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2)
    financing_used = models.BooleanField(default=False)
    down_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Usage tracking
    annual_days_used = models.IntegerField(default=0)
    annual_hours_used = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    usage_year = models.IntegerField()
    
    # Purchase status
    status = models.CharField(max_length=20, choices=PURCHASE_STATUS, default='pending')
    purchase_date = models.DateTimeField(auto_now_add=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    
    # Legal documents
    contract_signed = models.BooleanField(default=False)
    contract_date = models.DateTimeField(null=True, blank=True)
    share_certificate_issued = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'share_purchases'
        ordering = ['-purchase_date']
        
    def __str__(self):
        return f"{self.user.full_name} - {self.opportunity.yacht.name} ({self.shares_purchased} shares)"
    
    @property
    def total_annual_days_available(self):
        return self.opportunity.usage_days_per_year * self.shares_purchased
    
    @property
    def total_annual_hours_available(self):
        return self.opportunity.usage_hours_per_year * self.shares_purchased
    
    @property
    def remaining_days_this_year(self):
        return self.total_annual_days_available - self.annual_days_used
    
    @property
    def remaining_hours_this_year(self):
        return self.total_annual_hours_available - self.annual_hours_used
    
    def can_book_days(self, requested_days):
        """Check if user can book requested number of days"""
        return self.remaining_days_this_year >= requested_days

class ShareTransfer(models.Model):
    """
    Share transfers between owners (peer-to-peer trading)
    """
    
    TRANSFER_STATUS = [
        ('pending', 'Pending'),
        ('right_of_first_refusal', 'Right of First Refusal Period'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    share_purchase = models.ForeignKey(SharePurchase, on_delete=models.CASCADE, related_name='transfers')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shares_sold')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shares_bought', null=True, blank=True)
    
    # Transfer details
    shares_to_transfer = models.IntegerField(validators=[MinValueValidator(1)])
    asking_price = models.DecimalField(max_digits=12, decimal_places=2)
    final_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Right of first refusal (30-day period)
    right_of_first_refusal_expires = models.DateTimeField()
    existing_owners_notified = models.BooleanField(default=False)
    
    # Transfer status
    status = models.CharField(max_length=30, choices=TRANSFER_STATUS, default='pending')
    listed_date = models.DateTimeField(auto_now_add=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    
    # Legal and admin
    admin_approved = models.BooleanField(default=False)
    transfer_fee = models.DecimalField(max_digits=6, decimal_places=2, default=500.00)
    
    class Meta:
        db_table = 'share_transfers'
        ordering = ['-listed_date']
        
    def __str__(self):
        buyer_name = self.buyer.full_name if self.buyer else "No buyer yet"
        return f"{self.seller.full_name} → {buyer_name} ({self.shares_to_transfer} shares)"
    
    @property
    def is_in_right_of_first_refusal_period(self):
        from django.utils import timezone
        return timezone.now() < self.right_of_first_refusal_expires
    
    @property
    def price_per_share(self):
        return self.asking_price / self.shares_to_transfer if self.shares_to_transfer > 0 else 0

class OwnershipWaitlist(models.Model):
    """
    Waitlist for sold-out yacht ownership opportunities
    """
    
    PRIORITY_LEVELS = [
        ('standard', 'Standard'),
        ('high', 'High Priority'),
        ('vip', 'VIP'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    opportunity = models.ForeignKey(OwnershipOpportunity, on_delete=models.CASCADE, related_name='waitlist')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ownership_waitlist')
    
    # Waitlist details
    desired_shares = models.IntegerField(validators=[MinValueValidator(1)])
    max_price_per_share = models.DecimalField(max_digits=12, decimal_places=2)
    priority_level = models.CharField(max_length=20, choices=PRIORITY_LEVELS, default='standard')
    
    # Contact preferences
    notify_email = models.BooleanField(default=True)
    notify_sms = models.BooleanField(default=False)
    auto_purchase = models.BooleanField(default=False, help_text="Auto-purchase if shares become available")
    
    # Status
    is_active = models.BooleanField(default=True)
    position = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ownership_waitlist'
        ordering = ['priority_level', 'created_at']
        unique_together = ['opportunity', 'user']
        
    def __str__(self):
        return f"{self.user.full_name} - {self.opportunity.yacht.name} Waitlist"