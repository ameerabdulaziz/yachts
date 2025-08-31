"""
Task 2 - Boats API Models
Yacht/Boat models for public API
"""
from django.db import models

class Boat(models.Model):
    """
    Boat/Yacht model for Task 2 - Boats API (Public)
    Represents yachts available for rental and ownership
    """
    
    # Basic boat information
    name = models.CharField(max_length=100, help_text="Yacht name")
    model = models.CharField(max_length=50, help_text="Yacht model (e.g., D42, D50)")
    
    # Specifications
    capacity = models.PositiveIntegerField(help_text="Maximum number of passengers")
    length = models.DecimalField(max_digits=5, decimal_places=2, help_text="Length in meters")
    beam = models.DecimalField(max_digits=4, decimal_places=2, help_text="Beam width in meters", null=True, blank=True)
    
    # Location and availability
    location = models.CharField(max_length=100, help_text="Current location/marina")
    allow_public_rental = models.BooleanField(default=True, help_text="Available for public rental")
    
    # Pricing
    daily_rate = models.DecimalField(max_digits=8, decimal_places=2, help_text="Daily rental rate")
    
    # Additional details
    description = models.TextField(blank=True, help_text="Yacht description")
    image_url = models.URLField(blank=True, help_text="Main yacht image URL")
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'boats_boat'
        ordering = ['model', 'name']
        verbose_name = 'Boat'
        verbose_name_plural = 'Boats'
    
    def __str__(self):
        return f"{self.model} - {self.name}"

class BoatFeature(models.Model):
    """Features and amenities for boats"""
    
    boat = models.ForeignKey(Boat, on_delete=models.CASCADE, related_name='features')
    feature_name = models.CharField(max_length=100)
    feature_value = models.CharField(max_length=200, blank=True)
    
    class Meta:
        db_table = 'boats_boat_feature'
    
    def __str__(self):
        return f"{self.boat.name} - {self.feature_name}"