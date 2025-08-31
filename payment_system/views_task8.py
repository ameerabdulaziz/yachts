"""
Task 8 - Fuel Wallet (View + History) Views
API endpoints for fuel wallet management and transaction history
"""
import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from decimal import Decimal
from ownership.models import FuelWallet
from .models import FuelTransaction
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@require_http_methods(["GET"])
def get_fuel_wallet(request):
    """
    Task 8 - Get fuel wallet details and balance
    GET /fuel-wallet/?user_phone=+1234567890
    Returns: wallet balance, transaction history, and usage statistics
    """
    try:
        user_phone = request.GET.get('user_phone', '+201234567890')  # Demo mode
        
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
        
        if created:
            logger.info(f"Created new fuel wallet for user {user_phone}")
        
        # Get recent transactions
        recent_transactions = FuelTransaction.objects.filter(
            fuel_wallet=fuel_wallet
        ).order_by('-created_at')[:10]
        
        transactions_data = []
        for transaction in recent_transactions:
            transactions_data.append({
                'id': transaction.id,
                'transaction_type': transaction.transaction_type,
                'amount': str(transaction.amount),
                'balance_before': str(transaction.balance_before),
                'balance_after': str(transaction.balance_after),
                'description': transaction.description,
                'engine_hours': str(transaction.engine_hours) if transaction.engine_hours else None,
                'booking_id': transaction.booking.id if transaction.booking else None,
                'created_at': transaction.created_at.isoformat(),
            })
        
        # Calculate usage statistics
        total_transactions = FuelTransaction.objects.filter(fuel_wallet=fuel_wallet).count()
        
        consumption_transactions = FuelTransaction.objects.filter(
            fuel_wallet=fuel_wallet,
            transaction_type='consumption'
        )
        
        total_engine_hours = sum(
            t.engine_hours or Decimal('0') 
            for t in consumption_transactions
        )
        
        return JsonResponse({
            'success': True,
            'fuel_wallet': {
                'id': fuel_wallet.id,
                'owner_phone': user_phone,
                'current_balance': str(fuel_wallet.current_balance),
                'total_purchased': str(fuel_wallet.total_purchased),
                'total_consumed': str(fuel_wallet.total_consumed),
                'low_balance_threshold': str(fuel_wallet.low_balance_threshold),
                'is_low_balance': fuel_wallet.is_low_balance,
                'auto_topup_enabled': fuel_wallet.auto_topup_enabled,
                'auto_topup_amount': str(fuel_wallet.auto_topup_amount),
                'created_at': fuel_wallet.created_at.isoformat(),
                'updated_at': fuel_wallet.updated_at.isoformat(),
            },
            'transaction_summary': {
                'total_transactions': total_transactions,
                'recent_transactions_count': len(transactions_data),
                'total_engine_hours': str(total_engine_hours),
            },
            'recent_transactions': transactions_data,
        })
        
    except Exception as e:
        logger.error(f"Error getting fuel wallet: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Failed to get fuel wallet'
        }, status=500)

@require_http_methods(["GET"])
def get_fuel_transaction_history(request):
    """
    Get complete fuel transaction history
    GET /fuel-wallet/transactions/?user_phone=+1234567890&limit=50&transaction_type=purchase
    """
    try:
        user_phone = request.GET.get('user_phone', '+201234567890')
        limit = int(request.GET.get('limit', 50))
        transaction_type = request.GET.get('transaction_type')  # Optional filter
        
        try:
            user = User.objects.get(phone=user_phone)
            fuel_wallet = FuelWallet.objects.get(owner=user)
        except (User.DoesNotExist, FuelWallet.DoesNotExist):
            return JsonResponse({
                'success': False,
                'error': 'User or fuel wallet not found'
            }, status=404)
        
        # Build query
        transactions_query = FuelTransaction.objects.filter(fuel_wallet=fuel_wallet)
        
        if transaction_type:
            transactions_query = transactions_query.filter(transaction_type=transaction_type)
        
        transactions = transactions_query.order_by('-created_at')[:limit]
        
        transactions_data = []
        for transaction in transactions:
            transactions_data.append({
                'id': transaction.id,
                'transaction_type': transaction.transaction_type,
                'amount': str(transaction.amount),
                'balance_before': str(transaction.balance_before),
                'balance_after': str(transaction.balance_after),
                'description': transaction.description,
                'engine_hours': str(transaction.engine_hours) if transaction.engine_hours else None,
                'booking': {
                    'id': transaction.booking.id,
                    'boat_name': f"{transaction.booking.boat.model} {transaction.booking.boat.name}",
                    'start_date': transaction.booking.start_date.isoformat(),
                } if transaction.booking else None,
                'payment_intent_id': transaction.payment_intent.stripe_payment_intent_id if transaction.payment_intent else None,
                'created_at': transaction.created_at.isoformat(),
            })
        
        # Calculate filtered summary
        filtered_count = transactions_query.count()
        filtered_total = sum(
            transaction.amount 
            for transaction in transactions_query
        )
        
        return JsonResponse({
            'success': True,
            'transactions': transactions_data,
            'summary': {
                'total_transactions': filtered_count,
                'returned_transactions': len(transactions_data),
                'total_amount': str(filtered_total),
                'filter_applied': transaction_type,
            },
            'fuel_wallet': {
                'current_balance': str(fuel_wallet.current_balance),
                'is_low_balance': fuel_wallet.is_low_balance,
            }
        })
        
    except ValueError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid limit parameter'
        }, status=400)
    except Exception as e:
        logger.error(f"Error getting transaction history: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Failed to get transaction history'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def simulate_fuel_consumption(request):
    """
    Simulate fuel consumption for testing - Task 8
    POST /fuel-wallet/consume/
    Body: {"user_phone": "+1234567890", "booking_id": 123, "engine_hours": 5.5, "amount": 75.00}
    """
    try:
        data = json.loads(request.body)
        user_phone = data.get('user_phone', '+201234567890')
        booking_id = data.get('booking_id')
        engine_hours = Decimal(str(data.get('engine_hours', 0)))
        amount = Decimal(str(data.get('amount')))
        
        if not amount or amount <= 0:
            return JsonResponse({
                'success': False,
                'error': 'Amount must be greater than 0'
            }, status=400)
        
        try:
            user = User.objects.get(phone=user_phone)
            fuel_wallet = FuelWallet.objects.get(owner=user)
        except (User.DoesNotExist, FuelWallet.DoesNotExist):
            return JsonResponse({
                'success': False,
                'error': 'User or fuel wallet not found'
            }, status=404)
        
        # Check sufficient balance
        if fuel_wallet.current_balance < amount:
            return JsonResponse({
                'success': False,
                'error': f'Insufficient fuel balance. Current: ${fuel_wallet.current_balance}, Required: ${amount}'
            }, status=400)
        
        # Get booking if provided
        booking = None
        if booking_id:
            try:
                from bookings.models import Booking
                booking = Booking.objects.get(id=booking_id)
            except Booking.DoesNotExist:
                pass
        
        # Create consumption transaction
        balance_before = fuel_wallet.current_balance
        fuel_wallet.current_balance -= amount
        fuel_wallet.total_consumed += amount
        fuel_wallet.save()
        
        transaction = FuelTransaction.objects.create(
            fuel_wallet=fuel_wallet,
            booking=booking,
            transaction_type='consumption',
            amount=amount,
            balance_before=balance_before,
            balance_after=fuel_wallet.current_balance,
            engine_hours=engine_hours,
            description=f"Fuel consumption: {engine_hours} engine hours" + (f" for booking {booking_id}" if booking else "")
        )
        
        logger.info(f"Fuel consumption recorded: ${amount} for {engine_hours} hours")
        
        return JsonResponse({
            'success': True,
            'transaction': {
                'id': transaction.id,
                'transaction_type': transaction.transaction_type,
                'amount': str(transaction.amount),
                'engine_hours': str(transaction.engine_hours),
                'balance_after': str(transaction.balance_after),
                'created_at': transaction.created_at.isoformat(),
            },
            'fuel_wallet': {
                'current_balance': str(fuel_wallet.current_balance),
                'is_low_balance': fuel_wallet.is_low_balance,
            }
        })
        
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON or numeric values'
        }, status=400)
    except Exception as e:
        logger.error(f"Error simulating fuel consumption: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Failed to record fuel consumption'
        }, status=500)