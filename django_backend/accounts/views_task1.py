"""
Task 1 - OTP Authentication Views 
Simple Django views without DRF dependencies
"""
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import OTPVerification
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def request_otp(request):
    """
    Task 1 - Request OTP for phone number
    POST /auth/request-otp/
    Body: {"phone": "+1234567890"}
    """
    try:
        data = json.loads(request.body)
        phone = data.get('phone', '').strip()
        
        if not phone:
            return JsonResponse({
                'success': False,
                'message': 'Phone number is required'
            }, status=400)
        
        # Clean phone number
        cleaned_phone = ''.join(c for c in phone if c.isdigit() or c == '+')
        if not cleaned_phone.startswith('+'):
            cleaned_phone = '+' + cleaned_phone.lstrip('0')
        
        # Demo mode - create OTP record (Task 1 implementation)
        otp_record = OTPVerification.objects.create(
            phone=cleaned_phone,
            code="123456",  # Demo code as specified in task board
            verification_sid="demo_verification"
        )
        
        logger.info(f"OTP requested for {cleaned_phone}")
        
        return JsonResponse({
            'success': True,
            'message': 'OTP sent successfully. Demo code: 123456'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error requesting OTP: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to send OTP'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def verify_otp(request):
    """
    Task 1 - Verify OTP and authenticate user
    POST /auth/verify-otp/
    Body: {"phone": "+1234567890", "code": "123456"}
    Returns: {"access": "token", "refresh": "token", "user": {...}}
    """
    try:
        data = json.loads(request.body)
        phone = data.get('phone', '').strip()
        code = data.get('code', '').strip()
        
        if not phone or not code:
            return JsonResponse({
                'success': False,
                'message': 'Phone and code are required'
            }, status=400)
        
        # Clean phone number
        cleaned_phone = ''.join(c for c in phone if c.isdigit() or c == '+')
        if not cleaned_phone.startswith('+'):
            cleaned_phone = '+' + cleaned_phone.lstrip('0')
        
        # Verify OTP (demo mode as per task board requirements)
        otp_record = OTPVerification.objects.filter(
            phone=cleaned_phone,
            code=code,
            is_verified=False
        ).first()
        
        if not otp_record or code != "123456":
            return JsonResponse({
                'success': False,
                'message': 'Invalid OTP code'
            }, status=400)
        
        # Mark OTP as verified
        otp_record.is_verified = True
        otp_record.verified_at = timezone.now()
        otp_record.save()
        
        # Get or create user
        user, created = User.objects.get_or_create(
            phone=cleaned_phone,
            defaults={
                'is_phone_verified': True,
                'last_login': timezone.now()
            }
        )
        
        if not created:
            user.is_phone_verified = True
            user.last_login = timezone.now()
            user.save()
        
        # Generate demo JWT tokens (Task 1 requirement)
        demo_access_token = f"demo_access_token_for_user_{user.id}"
        demo_refresh_token = f"demo_refresh_token_for_user_{user.id}"
        
        logger.info(f"User authenticated successfully: {cleaned_phone}")
        
        # Return JWT response format as required by Task 1
        return JsonResponse({
            'access': demo_access_token,
            'refresh': demo_refresh_token,
            'user': {
                'id': user.id,
                'phone': user.phone,
                'email': user.email or '',
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_phone_verified': user.is_phone_verified,
                'date_joined': user.date_joined.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error verifying OTP: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Verification failed'
        }, status=500)