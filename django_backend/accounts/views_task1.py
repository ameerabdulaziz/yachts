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

# Additional authentication endpoints for complete Postman collection

@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    """
    Register a new user with phone number
    POST /auth/register/
    Body: {"phone": "+1234567890", "role": "renter", "email": "user@example.com", "first_name": "Test", "last_name": "User"}
    """
    try:
        data = json.loads(request.body)
        phone = data.get('phone', '').strip()
        role = data.get('role', 'renter')
        email = data.get('email', '')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        
        if not phone:
            return JsonResponse({
                'success': False,
                'message': 'Phone number is required'
            }, status=400)
        
        # Clean phone number
        cleaned_phone = ''.join(c for c in phone if c.isdigit() or c == '+')
        if not cleaned_phone.startswith('+'):
            cleaned_phone = '+' + cleaned_phone.lstrip('0')
        
        # Check if user already exists
        if User.objects.filter(phone=cleaned_phone).exists():
            return JsonResponse({
                'success': False,
                'message': 'User with this phone number already exists'
            }, status=400)
        
        # Create new user
        user = User.objects.create(
            phone=cleaned_phone,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        
        logger.info(f"New user registered: {cleaned_phone}")
        
        return JsonResponse({
            'success': True,
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'phone': user.phone,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Registration failed'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def send_otp(request):
    """
    Send OTP to phone number (alias for request_otp)
    POST /auth/send-otp/
    Body: {"phone": "+1234567890"}
    """
    return request_otp(request)

@csrf_exempt
@require_http_methods(["POST"])
def set_password(request):
    """
    Set password for user after OTP verification
    POST /auth/set-password/
    Body: {"phone": "+1234567890", "password": "SecurePass123!", "password_confirm": "SecurePass123!"}
    """
    try:
        data = json.loads(request.body)
        phone = data.get('phone', '').strip()
        password = data.get('password', '')
        password_confirm = data.get('password_confirm', '')
        
        if not phone or not password:
            return JsonResponse({
                'success': False,
                'message': 'Phone and password are required'
            }, status=400)
        
        if password != password_confirm:
            return JsonResponse({
                'success': False,
                'message': 'Passwords do not match'
            }, status=400)
        
        # Clean phone number
        cleaned_phone = ''.join(c for c in phone if c.isdigit() or c == '+')
        if not cleaned_phone.startswith('+'):
            cleaned_phone = '+' + cleaned_phone.lstrip('0')
        
        # Find user
        try:
            user = User.objects.get(phone=cleaned_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Set password
        user.set_password(password)
        user.save()
        
        logger.info(f"Password set for user: {cleaned_phone}")
        
        return JsonResponse({
            'success': True,
            'message': 'Password set successfully'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error setting password: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to set password'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def user_login(request):
    """
    Login user with phone and password
    POST /auth/login/
    Body: {"phone": "+1234567890", "password": "SecurePass123!"}
    """
    try:
        data = json.loads(request.body)
        phone = data.get('phone', '').strip()
        password = data.get('password', '')
        
        if not phone or not password:
            return JsonResponse({
                'success': False,
                'message': 'Phone and password are required'
            }, status=400)
        
        # Clean phone number
        cleaned_phone = ''.join(c for c in phone if c.isdigit() or c == '+')
        if not cleaned_phone.startswith('+'):
            cleaned_phone = '+' + cleaned_phone.lstrip('0')
        
        # Find and authenticate user
        try:
            user = User.objects.get(phone=cleaned_phone)
            if not user.check_password(password):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Invalid credentials'
            }, status=401)
        
        # Update last login
        user.last_login = timezone.now()
        user.save()
        
        # Generate demo JWT tokens
        demo_access_token = f"access_token_for_user_{user.id}"
        demo_refresh_token = f"refresh_token_for_user_{user.id}"
        
        logger.info(f"User logged in successfully: {cleaned_phone}")
        
        return JsonResponse({
            'access': demo_access_token,
            'refresh': demo_refresh_token,
            'user': {
                'id': user.id,
                'phone': user.phone,
                'email': user.email or '',
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'is_phone_verified': user.is_phone_verified,
                'date_joined': user.date_joined.isoformat(),
                'last_login': user.last_login.isoformat()
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Login failed'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_profile(request):
    """
    Get user profile
    GET /auth/profile/?phone=+1234567890
    """
    try:
        phone = request.GET.get('phone', '').strip()
        
        if not phone:
            return JsonResponse({
                'success': False,
                'message': 'Phone number is required'
            }, status=400)
        
        # Clean phone number
        cleaned_phone = ''.join(c for c in phone if c.isdigit() or c == '+')
        if not cleaned_phone.startswith('+'):
            cleaned_phone = '+' + cleaned_phone.lstrip('0')
        
        # Find user
        try:
            user = User.objects.get(phone=cleaned_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        return JsonResponse({
            'success': True,
            'user': {
                'id': user.id,
                'phone': user.phone,
                'email': user.email or '',
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'is_phone_verified': user.is_phone_verified,
                'date_joined': user.date_joined.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting profile: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to get profile'
        }, status=500)