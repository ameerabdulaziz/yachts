from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'phone', 'email', 'first_name', 'last_name',
            'profile_image_url', 'role', 'is_verified', 'fuel_wallet_balance',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Convert to frontend format
        data['firstName'] = data.pop('first_name')
        data['lastName'] = data.pop('last_name') 
        data['profileImageUrl'] = data.pop('profile_image_url')
        data['isVerified'] = data.pop('is_verified')
        data['fuelWalletBalance'] = str(data.pop('fuel_wallet_balance'))
        data['createdAt'] = data.pop('created_at')
        data['updatedAt'] = data.pop('updated_at')
        return data