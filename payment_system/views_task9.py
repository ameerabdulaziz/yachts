"""
Task 9 - Stripe PaymentIntent (Fuel Top-Up) Views
Create payment intents for fuel wallet top-ups
"""
import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from decimal import Decimal
from ownership.models import FuelWallet
from .models import PaymentIntent
from .stripe_service import stripe_service
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def create_payment_intent_fuel(request):
    """
    Task 9 - Create Stripe PaymentIntent for fuel wallet top-up
    POST /payments/fuel/create-intent/
    Body: {"user_phone": "+1234567890", "amount": 500.00}
    Returns: {"client_secret": "pi_...", "payment_intent_id": "pi_..."}
    """
    try:
        data = json.loads(request.body)
        user_phone = data.get('user_phone', '+201234567890')  # Demo mode
        amount = data.get('amount')
        
        if not amount or amount <= 0:
            return JsonResponse({
                'success': False,
                'error': 'Amount must be greater than 0'
            }, status=400)
        
        amount = Decimal(str(amount))
        
        # Validate amount limits
        if amount < Decimal('10.00'):
            return JsonResponse({
                'success': False,
                'error': 'Minimum top-up amount is $10.00'
            }, status=400)
        
        if amount > Decimal('5000.00'):
            return JsonResponse({
                'success': False,
                'error': 'Maximum top-up amount is $5000.00'
            }, status=400)
        
        try:
            user = User.objects.get(phone=user_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'User not found'
            }, status=404)
        
        # Get or create fuel wallet
        fuel_wallet, created = FuelWallet.objects.get_or_create(
            owner=user,
            defaults={
                'current_balance': Decimal('0.00'),
                'total_purchased': Decimal('0.00'),
                'total_consumed': Decimal('0.00'),
            }
        )
        
        # Create Stripe PaymentIntent
        description = f"Fuel wallet top-up: ${amount} for {user_phone}"
        
        metadata = {
            'user_phone': user_phone,
            'fuel_wallet_id': str(fuel_wallet.id),
            'topup_amount': str(amount),
            'current_balance': str(fuel_wallet.current_balance),
        }
        
        success, payment_intent_data, error = stripe_service.create_payment_intent(
            amount=float(amount),
            currency='usd',
            description=description,
            metadata=metadata
        )
        
        if not success:
            return JsonResponse({
                'success': False,
                'error': f'Failed to create payment intent: {error}'
            }, status=500)
        
        # Save PaymentIntent record
        payment_record = PaymentIntent.objects.create(
            stripe_payment_intent_id=payment_intent_data['id'],
            stripe_client_secret=payment_intent_data['client_secret'],
            user=user,
            payment_type='fuel_topup',
            amount=amount,
            currency='USD',
            status=payment_intent_data['status'],
            fuel_wallet=fuel_wallet,
            description=description,
            metadata=metadata
        )
        
        logger.info(f"Fuel top-up PaymentIntent created for user {user_phone}: {payment_record.stripe_payment_intent_id}")
        
        return JsonResponse({
            'success': True,
            'payment_intent_id': payment_intent_data['id'],
            'client_secret': payment_intent_data['client_secret'],
            'amount': float(amount),
            'currency': 'USD',
            'status': payment_intent_data['status'],
            'fuel_wallet': {
                'id': fuel_wallet.id,
                'current_balance': str(fuel_wallet.current_balance),
                'balance_after_topup': str(fuel_wallet.current_balance + amount),
                'is_low_balance': fuel_wallet.is_low_balance,
            }
        })
        
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON or amount value'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating fuel top-up payment intent: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Failed to create payment intent'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def auto_topup_fuel(request):
    """
    Trigger automatic fuel wallet top-up
    POST /fuel-wallet/auto-topup/
    Body: {"user_phone": "+1234567890"}
    """
    try:
        data = json.loads(request.body)
        user_phone = data.get('user_phone', '+201234567890')
        
        try:
            user = User.objects.get(phone=user_phone)
            fuel_wallet = FuelWallet.objects.get(owner=user)
        except (User.DoesNotExist, FuelWallet.DoesNotExist):
            return JsonResponse({
                'success': False,
                'error': 'User or fuel wallet not found'
            }, status=404)
        
        # Check if auto top-up is enabled and needed
        if not fuel_wallet.auto_topup_enabled:
            return JsonResponse({
                'success': False,
                'error': 'Auto top-up is not enabled for this wallet'
            }, status=400)
        
        if not fuel_wallet.is_low_balance:
            return JsonResponse({
                'success': True,
                'message': 'Auto top-up not needed - balance is sufficient',
                'current_balance': str(fuel_wallet.current_balance),
                'threshold': str(fuel_wallet.low_balance_threshold),
            })
        
        # Create payment intent for auto top-up amount
        topup_amount = fuel_wallet.auto_topup_amount
        
        description = f"Automatic fuel wallet top-up: ${topup_amount} for {user_phone}"
        
        metadata = {
            'user_phone': user_phone,
            'fuel_wallet_id': str(fuel_wallet.id),
            'topup_amount': str(topup_amount),
            'current_balance': str(fuel_wallet.current_balance),
            'auto_topup': 'true',
        }
        
        success, payment_intent_data, error = stripe_service.create_payment_intent(
            amount=float(topup_amount),
            currency='usd',
            description=description,
            metadata=metadata
        )
        
        if not success:
            return JsonResponse({
                'success': False,
                'error': f'Failed to create auto top-up payment intent: {error}'
            }, status=500)
        
        # Save PaymentIntent record
        payment_record = PaymentIntent.objects.create(
            stripe_payment_intent_id=payment_intent_data['id'],
            stripe_client_secret=payment_intent_data['client_secret'],
            user=user,
            payment_type='fuel_topup',
            amount=topup_amount,
            currency='USD',
            status=payment_intent_data['status'],
            fuel_wallet=fuel_wallet,
            description=description,
            metadata=metadata
        )
        
        logger.info(f"Auto fuel top-up PaymentIntent created for user {user_phone}: {payment_record.stripe_payment_intent_id}")
        
        return JsonResponse({
            'success': True,
            'message': 'Auto top-up payment intent created',
            'payment_intent_id': payment_intent_data['id'],
            'client_secret': payment_intent_data['client_secret'],
            'amount': float(topup_amount),
            'fuel_wallet': {
                'current_balance': str(fuel_wallet.current_balance),
                'low_balance_threshold': str(fuel_wallet.low_balance_threshold),
                'auto_topup_amount': str(fuel_wallet.auto_topup_amount),
            }
        })
        
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating auto top-up: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Failed to create auto top-up'
        }, status=500)