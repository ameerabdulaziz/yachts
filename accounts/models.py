from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    """Custom User model for phone-based authentication"""
    
    # Remove username requirement, use phone as unique identifier
    username = None
    
    # Phone number as primary identifier
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone = models.CharField(
        validators=[phone_regex], 
        max_length=17, 
        unique=True,
        help_text="Phone number in international format"
    )
    
    # Additional user fields
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use phone as the unique identifier for authentication
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['email']
    
    class Meta:
        db_table = 'accounts_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.phone

class OTPVerification(models.Model):
    """Store OTP verification attempts"""
    
    phone = models.CharField(max_length=17)
    code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Twilio verification SID for tracking
    verification_sid = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        db_table = 'accounts_otp_verification'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP for {self.phone} - {'Verified' if self.is_verified else 'Pending'}"