"""
User serializers for Nauttec API
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Complete user profile serializer"""
    full_name = serializers.ReadOnlyField()
    is_owner = serializers.ReadOnlyField()
    is_renter = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'first_name', 'last_name', 'full_name',
            'profile_image', 'role', 'is_verified', 'fuel_wallet_balance',
            'is_owner', 'is_renter', 'preferred_yacht_size', 'preferred_locations',
            'investment_budget', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'fuel_wallet_balance']

class UserRegistrationSerializer(serializers.ModelSerializer):
    """User registration with password"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'phone', 'first_name', 'last_name', 'password', 'password_confirm', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """Extended user profile"""
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']