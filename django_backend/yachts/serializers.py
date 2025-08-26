"""
Yacht serializers for Nauttec API
"""
from rest_framework import serializers
from .models import Yacht, YachtImage, YachtSpecification, YachtAvailability

class YachtImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = YachtImage
        fields = ['id', 'image', 'caption', 'is_primary', 'order']

class YachtSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = YachtSpecification
        fields = '__all__'

class YachtAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = YachtAvailability
        fields = ['date', 'is_available', 'reason', 'price_override']

class YachtListSerializer(serializers.ModelSerializer):
    """Yacht list view with essential info"""
    current_price = serializers.SerializerMethodField()
    is_available_for_booking = serializers.ReadOnlyField()
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Yacht
        fields = [
            'id', 'name', 'model', 'location', 'length', 'capacity', 'cabins',
            'current_price', 'rating', 'review_count', 'is_available_for_booking',
            'primary_image', 'status'
        ]
    
    def get_current_price(self, obj):
        return obj.get_current_price()
    
    def get_primary_image(self, obj):
        primary_img = obj.yacht_images.filter(is_primary=True).first()
        if primary_img:
            return primary_img.image.url if primary_img.image else None
        return None

class YachtDetailSerializer(serializers.ModelSerializer):
    """Complete yacht details"""
    yacht_images = YachtImageSerializer(many=True, read_only=True)
    specifications = YachtSpecificationSerializer(read_only=True)
    availability = YachtAvailabilitySerializer(many=True, read_only=True)
    current_price = serializers.SerializerMethodField()
    ownership_opportunities_count = serializers.ReadOnlyField()
    total_shares_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Yacht
        fields = '__all__'
    
    def get_current_price(self, obj):
        return obj.get_current_price()