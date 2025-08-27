from rest_framework import serializers
from .models import Yacht

class YachtSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.URLField(), 
        required=False,
        allow_empty=True
    )
    amenities = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False, 
        allow_empty=True
    )
    
    class Meta:
        model = Yacht
        fields = [
            'id', 'name', 'description', 'location', 'price_per_day',
            'capacity', 'cabins', 'length', 'year_built', 'images',
            'amenities', 'owner_id', 'is_active', 'rating', 'review_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Convert to match frontend expected format
        data['pricePerDay'] = str(data.pop('price_per_day'))
        data['yearBuilt'] = data.pop('year_built')
        data['reviewCount'] = data.pop('review_count')
        data['ownerId'] = data.pop('owner_id')
        data['isActive'] = data.pop('is_active')
        data['createdAt'] = data.pop('created_at')
        data['updatedAt'] = data.pop('updated_at')
        return data