"""
OTP Authentication API Views
Task 1 - OTP Auth (Twilio Verify) implementation
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from .serializers import OTPRequestSerializer, OTPVerifySerializer, UserSerializer
from .auth import twilio_otp_service
from .models import OTPVerification
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def request_otp(request):
    """
    Request OTP for phone number
    POST /auth/request-otp/
    Body: {"phone": "+1234567890"}
    Response: {"success": true, "message": "OTP sent to phone"}
    """
    serializer = OTPRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid phone number',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    phone = serializer.validated_data['phone']
    
    try:
        # Send OTP via Twilio
        success, message, verification_sid = twilio_otp_service.send_otp(phone)
        
        if success:
            logger.info(f"OTP requested for {phone}")
            return Response({
                'success': True,
                'message': message
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Error requesting OTP for {phone}: {e}")
        return Response({
            'success': False,
            'message': 'Failed to send OTP'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST']) 
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verify OTP and authenticate user
    POST /auth/verify-otp/
    Body: {"phone": "+1234567890", "code": "123456"}
    Response: {"access": "jwt_token", "refresh": "refresh_token", "user": {...}}
    """
    serializer = OTPVerifySerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid request data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    phone = serializer.validated_data['phone']
    code = serializer.validated_data['code']
    
    try:
        # Verify OTP via Twilio
        success, message = twilio_otp_service.verify_otp(phone, code)
        
        if not success:
            return Response({
                'success': False,
                'message': message
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create user
        user, created = User.objects.get_or_create(
            phone=phone,
            defaults={
                'is_phone_verified': True,
                'last_login': timezone.now()
            }
        )
        
        if not created:
            # Update existing user
            user.is_phone_verified = True
            user.last_login = timezone.now()
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        # Serialize user data
        user_serializer = UserSerializer(user)
        
        logger.info(f"User authenticated successfully: {phone}")
        
        return Response({
            'access': str(access),
            'refresh': str(refresh),
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error verifying OTP for {phone}: {e}")
        return Response({
            'success': False,
            'message': 'Verification failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def current_user(request):
    """
    Get current authenticated user
    GET /auth/user/
    Response: {"user": {...}}
    """
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response({
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)