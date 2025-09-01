"""
Ownership and Fuel Wallet Views
API endpoints for fractional yacht ownership and fuel wallet management
"""
import json
from decimal import Decimal
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from .models import FractionalOwnership, FuelWallet, BookingRule
from boats.models import Boat
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

# Fractional Ownership Endpoints

@csrf_exempt
@require_http_methods(["GET"])
def list_ownerships(request):
    """
    List all fractional ownerships
    GET /ownership/
    Query params: boat_id, user_phone, status (optional)
    """
    try:
        # Get query parameters
        boat_id = request.GET.get('boat_id')
        user_phone = request.GET.get('user_phone')
        status = request.GET.get('status')
        
        # Base query
        ownerships_query = FractionalOwnership.objects.all().select_related('boat', 'owner')
        
        # Apply filters
        if boat_id:
            ownerships_query = ownerships_query.filter(boat_id=boat_id)
        if user_phone:
            ownerships_query = ownerships_query.filter(owner__phone=user_phone)
        if status:
            ownerships_query = ownerships_query.filter(is_active=(status == 'active'))
        
        ownerships = ownerships_query.order_by('-created_at')
        
        ownerships_data = []
        for ownership in ownerships:
            ownerships_data.append({
                'id': ownership.id,
                'boat': {
                    'id': ownership.boat.id,
                    'name': ownership.boat.name,
                    'model': ownership.boat.model,
                    'location': ownership.boat.location,
                },
                'owner': {
                    'phone': ownership.owner.phone,
                    'first_name': ownership.owner.first_name,
                    'last_name': ownership.owner.last_name,
                },
                'share_percentage': ownership.share_percentage,
                'is_active': ownership.is_active,
                'annual_day_limit': ownership.annual_day_limit,
                'annual_hour_limit': ownership.annual_hour_limit,
                'current_year_days_used': ownership.current_year_days_used,
                'current_year_hours_used': str(ownership.current_year_hours_used),
                'remaining_days': ownership.remaining_days,
                'remaining_hours': str(ownership.remaining_hours),
                'purchase_price': str(ownership.purchase_price) if ownership.purchase_price else None,
                'created_at': ownership.created_at.isoformat(),
            })
        
        return JsonResponse({
            'ownerships': ownerships_data,
            'total_count': len(ownerships_data),
            'filters': {
                'boat_id': boat_id,
                'user_phone': user_phone,
                'status': status,
            }
        })
        
    except Exception as e:
        logger.error(f"Error listing ownerships: {e}")
        return JsonResponse({
            'error': 'Failed to list ownerships'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def user_ownership(request, user_phone):
    """
    Get ownership details for a specific user
    GET /ownership/user/{phone}/
    """
    try:
        user = User.objects.get(phone=user_phone)
        ownerships = FractionalOwnership.objects.filter(owner=user).select_related('boat')
        
        if not ownerships.exists():
            return JsonResponse({
                'user_phone': user_phone,
                'ownerships': [],
                'total_ownerships': 0,
                'message': 'No ownership found for this user'
            })
        
        ownerships_data = []
        for ownership in ownerships:
            ownerships_data.append({
                'id': ownership.id,
                'boat': {
                    'id': ownership.boat.id,
                    'name': ownership.boat.name,
                    'model': ownership.boat.model,
                    'location': ownership.boat.location,
                },
                'share_percentage': ownership.share_percentage,
                'status': ownership.status,
                'annual_usage_limit': ownership.annual_usage_limit,
                'current_usage_days': ownership.current_usage_days,
                'remaining_days': ownership.annual_usage_limit - ownership.current_usage_days if ownership.annual_usage_limit else None,
                'purchase_price': str(ownership.purchase_price) if ownership.purchase_price else None,
                'created_at': ownership.created_at.isoformat(),
            })
        
        return JsonResponse({
            'owner': {
                'phone': user.phone,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'ownerships': ownerships_data,
            'total_ownerships': len(ownerships_data),
        })
        
    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found'
        }, status=404)
    except Exception as e:
        logger.error(f"Error fetching user ownership: {e}")
        return JsonResponse({
            'error': 'Failed to fetch user ownership'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def ownership_detail(request, ownership_id):
    """
    Get detailed information for a specific ownership
    GET /ownership/{id}/
    """
    try:
        ownership = FractionalOwnership.objects.select_related('boat', 'owner').get(id=ownership_id)
        
        return JsonResponse({
            'id': ownership.id,
            'boat': {
                'id': ownership.boat.id,
                'name': ownership.boat.name,
                'model': ownership.boat.model,
                'location': ownership.boat.location,
                'daily_rate': str(ownership.boat.daily_rate) if ownership.boat.daily_rate else None,
            },
            'owner': {
                'phone': ownership.owner.phone,
                'first_name': ownership.owner.first_name,
                'last_name': ownership.owner.last_name,
                'email': ownership.owner.email,
            },
            'share_percentage': ownership.share_percentage,
            'is_active': ownership.is_active,
            'annual_day_limit': ownership.annual_day_limit,
            'annual_hour_limit': ownership.annual_hour_limit,
            'current_year_days_used': ownership.current_year_days_used,
            'current_year_hours_used': str(ownership.current_year_hours_used),
            'remaining_days': ownership.remaining_days,
            'remaining_hours': str(ownership.remaining_hours),
            'purchase_price': str(ownership.purchase_price) if ownership.purchase_price else None,
            'created_at': ownership.created_at.isoformat(),
            'updated_at': ownership.updated_at.isoformat(),
        })
        
    except FractionalOwnership.DoesNotExist:
        return JsonResponse({
            'error': 'Ownership not found'
        }, status=404)
    except Exception as e:
        logger.error(f"Error fetching ownership detail: {e}")
        return JsonResponse({
            'error': 'Failed to fetch ownership details'
        }, status=500)

# Fuel Wallet Endpoints

@csrf_exempt
@require_http_methods(["GET"])
def list_fuel_wallets(request):
    """
    List all fuel wallets
    GET /fuel-wallet/
    Query params: user_phone, status (optional)
    """
    try:
        # Get query parameters
        user_phone = request.GET.get('user_phone')
        status = request.GET.get('status')
        
        # Base query
        wallets_query = FuelWallet.objects.all().select_related('owner')
        
        # Apply filters
        if user_phone:
            wallets_query = wallets_query.filter(owner__phone=user_phone)
        
        wallets = wallets_query.order_by('-created_at')
        
        wallets_data = []
        for wallet in wallets:
            wallets_data.append({
                'id': wallet.id,
                'owner': {
                    'phone': wallet.owner.phone,
                    'first_name': wallet.owner.first_name,
                    'last_name': wallet.owner.last_name,
                },
                'current_balance': str(wallet.current_balance),
                'total_purchased': str(wallet.total_purchased),
                'total_consumed': str(wallet.total_consumed),
                'low_balance_threshold': str(wallet.low_balance_threshold),
                'auto_topup_enabled': wallet.auto_topup_enabled,
                'auto_topup_amount': str(wallet.auto_topup_amount),
                'is_low_balance': wallet.is_low_balance,
                'created_at': wallet.created_at.isoformat(),
                'last_transaction': wallet.updated_at.isoformat(),
            })
        
        return JsonResponse({
            'fuel_wallets': wallets_data,
            'total_count': len(wallets_data),
            'filters': {
                'user_phone': user_phone,
            }
        })
        
    except Exception as e:
        logger.error(f"Error listing fuel wallets: {e}")
        return JsonResponse({
            'error': 'Failed to list fuel wallets'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def user_fuel_wallet(request, user_phone):
    """
    Get fuel wallet for a specific user
    GET /fuel-wallet/user/{phone}/
    """
    try:
        user = User.objects.get(phone=user_phone)
        wallet = FuelWallet.objects.get(owner=user)
        
        return JsonResponse({
            'id': wallet.id,
            'owner': {
                'phone': user.phone,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'current_balance': str(wallet.current_balance),
            'total_purchased': str(wallet.total_purchased),
            'total_consumed': str(wallet.total_consumed),
            'low_balance_threshold': str(wallet.low_balance_threshold),
            'auto_topup_enabled': wallet.auto_topup_enabled,
            'auto_topup_amount': str(wallet.auto_topup_amount),
            'is_low_balance': wallet.is_low_balance,
            'created_at': wallet.created_at.isoformat(),
            'last_transaction': wallet.updated_at.isoformat(),
        })
        
    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found'
        }, status=404)
    except FuelWallet.DoesNotExist:
        return JsonResponse({
            'error': 'Fuel wallet not found for this user'
        }, status=404)
    except Exception as e:
        logger.error(f"Error fetching user fuel wallet: {e}")
        return JsonResponse({
            'error': 'Failed to fetch fuel wallet'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def fuel_wallet_detail(request, wallet_id):
    """
    Get detailed information for a specific fuel wallet
    GET /fuel-wallet/{id}/
    """
    try:
        wallet = FuelWallet.objects.select_related('owner').get(id=wallet_id)
        
        return JsonResponse({
            'id': wallet.id,
            'owner': {
                'phone': wallet.owner.phone,
                'first_name': wallet.owner.first_name,
                'last_name': wallet.owner.last_name,
                'email': wallet.owner.email,
            },
            'current_balance': str(wallet.current_balance),
            'total_purchased': str(wallet.total_purchased),
            'total_consumed': str(wallet.total_consumed),
            'low_balance_threshold': str(wallet.low_balance_threshold),
            'auto_topup_enabled': wallet.auto_topup_enabled,
            'auto_topup_amount': str(wallet.auto_topup_amount),
            'is_low_balance': wallet.is_low_balance,
            'created_at': wallet.created_at.isoformat(),
            'updated_at': wallet.updated_at.isoformat(),
        })
        
    except FuelWallet.DoesNotExist:
        return JsonResponse({
            'error': 'Fuel wallet not found'
        }, status=404)
    except Exception as e:
        logger.error(f"Error fetching fuel wallet detail: {e}")
        return JsonResponse({
            'error': 'Failed to fetch fuel wallet details'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def fuel_transactions(request, wallet_id):
    """
    Get transaction history for a fuel wallet
    GET /fuel-wallet/{id}/transactions/
    """
    try:
        wallet = FuelWallet.objects.get(id=wallet_id)
        
        # For now, return basic wallet info
        # In a full implementation, you'd have a FuelTransaction model
        return JsonResponse({
            'wallet_id': wallet.id,
            'user_phone': wallet.owner.phone,
            'current_balance': str(wallet.current_balance),
            'transactions': [
                {
                    'id': 'demo_1',
                    'type': 'credit',
                    'amount': '500.00',
                    'description': 'Initial wallet setup',
                    'timestamp': wallet.created_at.isoformat(),
                },
                {
                    'id': 'demo_2',
                    'type': 'debit',
                    'amount': '75.00',
                    'description': 'Fuel usage - Booking #123',
                    'timestamp': wallet.updated_at.isoformat(),
                }
            ],
            'message': 'Demo transaction data - implement FuelTransaction model for full functionality'
        })
        
    except FuelWallet.DoesNotExist:
        return JsonResponse({
            'error': 'Fuel wallet not found'
        }, status=404)
    except Exception as e:
        logger.error(f"Error fetching fuel transactions: {e}")
        return JsonResponse({
            'error': 'Failed to fetch fuel transactions'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def add_fuel_funds(request, wallet_id):
    """
    Add funds to a fuel wallet
    POST /fuel-wallet/{id}/add-funds/
    Body: {"amount": "100.00", "payment_method": "stripe", "notes": "Wallet top-up"}
    """
    try:
        data = json.loads(request.body)
        amount = Decimal(str(data.get('amount', '0')))
        payment_method = data.get('payment_method', 'cash')
        notes = data.get('notes', '')
        
        if amount <= 0:
            return JsonResponse({
                'success': False,
                'message': 'Amount must be greater than 0'
            }, status=400)
        
        wallet = FuelWallet.objects.select_related('owner').get(id=wallet_id)
        old_balance = wallet.current_balance
        wallet.current_balance += amount
        wallet.total_purchased += amount
        wallet.save()
        
        logger.info(f"Fuel wallet {wallet_id} credited with {amount}. New balance: {wallet.current_balance}")
        
        return JsonResponse({
            'success': True,
            'message': f'Successfully added {amount} to fuel wallet',
            'wallet': {
                'id': wallet.id,
                'user_phone': wallet.owner.phone,
                'old_balance': str(old_balance),
                'amount_added': str(amount),
                'new_balance': str(wallet.current_balance),
                'payment_method': payment_method,
                'notes': notes,
                'timestamp': wallet.updated_at.isoformat(),
            }
        })
        
    except FuelWallet.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Fuel wallet not found'
        }, status=404)
    except (ValueError, TypeError):
        return JsonResponse({
            'success': False,
            'message': 'Invalid amount format'
        }, status=400)
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error adding fuel funds: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to add fuel funds'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def deduct_fuel(request, wallet_id):
    """
    Deduct fuel from wallet (for bookings)
    POST /fuel-wallet/{id}/deduct/
    Body: {"amount": "75.00", "booking_id": 123, "description": "Fuel usage for booking"}
    """
    try:
        data = json.loads(request.body)
        amount = Decimal(str(data.get('amount', '0')))
        booking_id = data.get('booking_id')
        description = data.get('description', 'Fuel deduction')
        
        if amount <= 0:
            return JsonResponse({
                'success': False,
                'message': 'Amount must be greater than 0'
            }, status=400)
        
        wallet = FuelWallet.objects.select_related('owner').get(id=wallet_id)
        
        if wallet.current_balance < amount:
            return JsonResponse({
                'success': False,
                'message': f'Insufficient fuel balance. Available: {wallet.current_balance}, Required: {amount}'
            }, status=400)
        
        old_balance = wallet.current_balance
        wallet.current_balance -= amount
        wallet.total_consumed += amount
        wallet.save()
        
        logger.info(f"Fuel wallet {wallet_id} debited {amount} for booking {booking_id}. New balance: {wallet.current_balance}")
        
        return JsonResponse({
            'success': True,
            'message': f'Successfully deducted {amount} from fuel wallet',
            'wallet': {
                'id': wallet.id,
                'user_phone': wallet.owner.phone,
                'old_balance': str(old_balance),
                'amount_deducted': str(amount),
                'new_balance': str(wallet.current_balance),
                'booking_id': booking_id,
                'description': description,
                'timestamp': wallet.updated_at.isoformat(),
            }
        })
        
    except FuelWallet.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Fuel wallet not found'
        }, status=404)
    except (ValueError, TypeError):
        return JsonResponse({
            'success': False,
            'message': 'Invalid amount format'
        }, status=400)
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error deducting fuel: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to deduct fuel'
        }, status=500)