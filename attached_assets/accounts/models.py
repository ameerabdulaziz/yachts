"""
User Account Models for Nauttec Yacht Platform
Custom user model with yacht ownership roles
"""
from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models
import uuid


class UserManager(DjangoUserManager):
    use_in_migrations = True

    def _unique_username_from_email(self, email):
        base = email.split("@")[0][:150]
        username = base
        i = 1
        from django.contrib.auth import get_user_model
        User = get_user_model()
        while User.objects.filter(username=username).exists():
            suffix = f"_{i}"
            username = (base[:150 - len(suffix)] + suffix)
            i += 1
        return username

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        # Ensure username exists because AbstractUser still has that field
        username = extra_fields.get("username") or self._unique_username_from_email(email)
        # Pop username from extra_fields to avoid passing it twice
        if "username" in extra_fields:
            extra_fields.pop("username")
        return super()._create_user(username, email, password, **extra_fields)

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model for Nauttec platform
    Supports multiple authentication methods and yacht ownership roles
    """
    objects = UserManager()

    USER_ROLES = [
        ('visitor', 'Visitor'),
        ('renter', 'Renter'),
        ('owner', 'Owner'),
        ('both', 'Owner & Renter'),
        ('admin', 'Administrator'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    role = models.CharField(max_length=20, choices=USER_ROLES, default='renter')
    is_verified = models.BooleanField(default=False)
    fuel_wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # OAuth fields
    google_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    facebook_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    
    # Yacht ownership preferences
    preferred_yacht_size = models.CharField(max_length=50, null=True, blank=True)
    preferred_locations = models.JSONField(default=list, blank=True)
    investment_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Platform engagement
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    notification_preferences = models.JSONField(default=dict, blank=True)
    
    # Use email as username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_owner(self):
        return self.role in ['owner', 'both']
    
    @property
    def is_renter(self):
        return self.role in ['renter', 'both']
    
    def get_owned_shares(self):
        """Get all yacht shares owned by this user"""
        from ownership.models import SharePurchase
        return SharePurchase.objects.filter(user=self)
    
    def get_total_investment(self):
        """Calculate total investment in yacht shares"""
        shares = self.get_owned_shares()
        return sum(share.purchase_price for share in shares)
    
    def can_book_yacht(self, yacht):
        """Check if user can book a specific yacht"""
        if self.role == 'admin':
            return True
        if self.is_owner and yacht in [share.opportunity.yacht for share in self.get_owned_shares()]:
            return True
        return self.is_renter


class UserProfile(models.Model):
    """
    Extended user profile for yacht preferences and history
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    sailing_experience = models.CharField(max_length=100, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    
    # Privacy settings
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('owners_only', 'Yacht Owners Only'),
            ('private', 'Private'),
        ],
        default='owners_only'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        
    def __str__(self):
        return f"{self.user.full_name} Profile"