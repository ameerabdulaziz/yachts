"""
DRF Serializers for OTP Authentication
Task 1 - OTP Auth implementation
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import OTPVerification

User = get_user_model()

class OTPRequestSerializer(serializers.Serializer):
    """Serializer for OTP request endpoint"""
    phone = serializers.CharField(
        max_length=17,
        help_text="Phone number in international format (e.g., +1234567890)"
    )
    
    def validate_phone(self, value):
        """Validate phone number format"""
        # Remove any spaces or special characters except +
        cleaned_phone = ''.join(c for c in value if c.isdigit() or c == '+')
        
        # Ensure it starts with + and has valid length
        if not cleaned_phone.startswith('+'):
            cleaned_phone = '+' + cleaned_phone.lstrip('0')
        
        if len(cleaned_phone) < 10 or len(cleaned_phone) > 17:
            raise serializers.ValidationError("Invalid phone number length")
        
        return cleaned_phone

class OTPVerifySerializer(serializers.Serializer):
    """Serializer for OTP verification endpoint"""
    phone = serializers.CharField(max_length=17)
    code = serializers.CharField(
        max_length=6,
        min_length=4,
        help_text="OTP code received via SMS"
    )
    
    def validate_code(self, value):
        """Validate OTP code format"""
        if not value.isdigit():
            raise serializers.ValidationError("OTP code must contain only digits")
        return value

class UserSerializer(serializers.ModelSerializer):
    """User serializer for API responses"""
    
    class Meta:
        model = User
        fields = [
            'id',
            'phone', 
            'email',
            'first_name',
            'last_name',
            'is_phone_verified',
            'date_joined',
            'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']

class AuthResponseSerializer(serializers.Serializer):
    """Serializer for authentication response"""
    access = serializers.CharField(help_text="JWT access token")
    refresh = serializers.CharField(help_text="JWT refresh token") 
    user = UserSerializer(help_text="User information")
    
    class Meta:
        fields = ['access', 'refresh', 'user']