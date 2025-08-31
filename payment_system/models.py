"""
Payment Models for Tasks 6-10
Stripe payment tracking and fuel wallet transactions
"""
from django.db import models
from django.contrib.auth import get_user_model
from bookings.models import Booking
from ownership.models import FuelWallet
from decimal import Decimal

User = get_user_model()

class PaymentIntent(models.Model):
    """
    Track Stripe PaymentIntents - Tasks 6 & 9
    Links bookings and fuel top-ups to payment processing
    """
    
    PAYMENT_TYPE_CHOICES = [
        ('rental_booking', 'Rental Booking Payment'),
        ('fuel_topup', 'Fuel Wallet Top-up'),
        ('ownership_purchase', 'Ownership Purchase'),
    ]
    
    STATUS_CHOICES = [
        ('requires_payment_method', 'Requires Payment Method'),
        ('requires_confirmation', 'Requires Confirmation'), 
        ('requires_action', 'Requires Action'),
        ('processing', 'Processing'),
        ('requires_capture', 'Requires Capture'),
        ('canceled', 'Canceled'),
        ('succeeded', 'Succeeded'),
    ]
    
    # Stripe identifiers
    stripe_payment_intent_id = models.CharField(max_length=200, unique=True)
    stripe_client_secret = models.CharField(max_length=500, blank=True)
    
    # Payment details
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_intents')
    payment_type = models.CharField(max_length=30, choices=PAYMENT_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='requires_payment_method')
    
    # Associated records
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True, related_name='payment_intents')
    fuel_wallet = models.ForeignKey(FuelWallet, on_delete=models.CASCADE, null=True, blank=True, related_name='payment_intents')
    
    # Metadata
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    stripe_created = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'payment_system_payment_intent'
        ordering = ['-created_at']
        verbose_name = 'Payment Intent'
        verbose_name_plural = 'Payment Intents'
    
    def __str__(self):
        return f"{self.payment_type} - ${self.amount} ({self.status})"

class FuelTransaction(models.Model):
    """
    Fuel wallet transaction history - Task 8
    Track fuel purchases and consumption
    """
    
    TRANSACTION_TYPE_CHOICES = [
        ('purchase', 'Fuel Purchase'),
        ('consumption', 'Fuel Consumption'),
        ('refund', 'Fuel Refund'),
        ('adjustment', 'Balance Adjustment'),
    ]
    
    fuel_wallet = models.ForeignKey(FuelWallet, on_delete=models.CASCADE, related_name='transactions')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='fuel_transactions')
    payment_intent = models.ForeignKey(PaymentIntent, on_delete=models.SET_NULL, null=True, blank=True, related_name='fuel_transactions')
    
    # Transaction details
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount in fuel credits")
    balance_before = models.DecimalField(max_digits=10, decimal_places=2)
    balance_after = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Additional details
    description = models.TextField(blank=True)
    engine_hours = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Engine hours for consumption")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payment_system_fuel_transaction'
        ordering = ['-created_at']
        verbose_name = 'Fuel Transaction'
        verbose_name_plural = 'Fuel Transactions'
    
    def __str__(self):
        return f"{self.transaction_type} - ${self.amount} ({self.fuel_wallet.owner.phone})"
