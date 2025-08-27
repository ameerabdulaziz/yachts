"""
Yacht Models for Nauttec Platform
De Antonio yacht fleet management with authentic specifications
"""
from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Yacht(models.Model):
    """
    Yacht model representing De Antonio yacht fleet (D29-D60)
    """
    
    YACHT_MODELS = [
        ('D29', 'De Antonio D29'),
        ('D32', 'De Antonio D32'),
        ('D36', 'De Antonio D36'),
        ('D42', 'De Antonio D42'),
        ('D50', 'De Antonio D50'),
        ('D60', 'De Antonio D60'),
    ]
    
    YACHT_STATUS = [
        ('available', 'Available'),
        ('maintenance', 'Under Maintenance'),
        ('booked', 'Currently Booked'),
        ('sold_out', 'Fully Owned'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=10, choices=YACHT_MODELS)
    description = models.TextField()
    location = models.CharField(max_length=255, default="El Gouna, Egypt")
    
    # Yacht specifications (authentic De Antonio data)
    length = models.DecimalField(max_digits=5, decimal_places=2, help_text="Length in meters")
    capacity = models.IntegerField(help_text="Maximum passengers")
    cabins = models.IntegerField()
    max_power = models.IntegerField(null=True, blank=True, help_text="Maximum HP")
    year_built = models.IntegerField()
    
    # Pricing and availability
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    seasonal_multiplier = models.DecimalField(max_digits=3, decimal_places=2, default=1.00)
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=YACHT_STATUS, default='available')
    
    # Media and features
    images = models.JSONField(default=list, help_text="Array of image URLs")
    amenities = models.JSONField(default=list, help_text="Yacht amenities and features")
    
    # Ratings and reviews
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    review_count = models.IntegerField(default=0)
    
    # Owner information
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='owned_yachts')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'yachts'
        ordering = ['model', 'name']
        
    def __str__(self):
        return f"{self.name} ({self.model})"
    
    @property
    def is_available_for_booking(self):
        return self.is_active and self.status == 'available'
    
    @property
    def ownership_opportunities_count(self):
        return self.ownership_opportunities.filter(is_active=True).count()
    
    @property
    def total_shares_available(self):
        opportunities = self.ownership_opportunities.filter(is_active=True)
        return sum(opp.available_shares for opp in opportunities)
    
    def get_current_price(self, date=None):
        """Calculate current price including seasonal multipliers"""
        base_price = self.price_per_day
        if date:
            # Apply seasonal multipliers based on date
            # High season: July-August, December-January
            month = date.month
            if month in [7, 8, 12, 1]:
                return base_price * 1.5
            elif month in [6, 9, 11]:
                return base_price * 1.2
        return base_price * self.seasonal_multiplier

class YachtImage(models.Model):
    """
    High-resolution yacht images for gallery display
    """
    yacht = models.ForeignKey(Yacht, on_delete=models.CASCADE, related_name='yacht_images')
    image = models.ImageField(upload_to='yachts/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'yacht_images'
        ordering = ['order', 'is_primary']
        
    def __str__(self):
        return f"{self.yacht.name} - Image {self.order}"

class YachtSpecification(models.Model):
    """
    Detailed yacht specifications and features
    """
    yacht = models.OneToOneField(Yacht, on_delete=models.CASCADE, related_name='specifications')
    
    # Engine specifications
    engine_type = models.CharField(max_length=100, blank=True)
    fuel_capacity = models.IntegerField(null=True, blank=True, help_text="Liters")
    fuel_consumption = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="L/hour")
    max_speed = models.IntegerField(null=True, blank=True, help_text="Knots")
    cruising_speed = models.IntegerField(null=True, blank=True, help_text="Knots")
    
    # Layout and comfort
    beam = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, help_text="Meters")
    draft = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True, help_text="Meters")
    water_capacity = models.IntegerField(null=True, blank=True, help_text="Liters")
    
    # Equipment and features
    navigation_equipment = models.JSONField(default=list)
    safety_equipment = models.JSONField(default=list)
    comfort_features = models.JSONField(default=list)
    
    class Meta:
        db_table = 'yacht_specifications'
        
    def __str__(self):
        return f"{self.yacht.name} Specifications"

class YachtAvailability(models.Model):
    """
    Yacht availability calendar for booking management
    """
    yacht = models.ForeignKey(Yacht, on_delete=models.CASCADE, related_name='availability')
    date = models.DateField()
    is_available = models.BooleanField(default=True)
    reason = models.CharField(max_length=100, blank=True, help_text="Reason if not available")
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    class Meta:
        db_table = 'yacht_availability'
        unique_together = ['yacht', 'date']
        ordering = ['date']
        
    def __str__(self):
        status = "Available" if self.is_available else "Unavailable"
        return f"{self.yacht.name} - {self.date} ({status})"