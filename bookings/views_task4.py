"""
Task 4 - Owner Booking (Write + Rules v1) Views
API endpoints for creating owner bookings with rules validation
"""
import json
from datetime import datetime, date, timedelta
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from decimal import Decimal
from .models import Booking
from boats.models import Boat
from ownership.models import FractionalOwnership, BookingRule, FuelWallet
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def create_owner_booking(request):
    """
    Task 4 - Create owner booking with rules validation
    POST /bookings/owner/
    Body: {"boat_id": 1, "start_date": "2025-09-15", "end_date": "2025-09-17", "guest_count": 8, "notes": ""}
    """
    try:
        data = json.loads(request.body)
        
        # Extract booking data
        boat_id = data.get('boat_id')
        user_phone = data.get('user_phone', '+201234567890')  # Demo mode
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        guest_count = data.get('guest_count', 1)
        notes = data.get('notes', '')
        
        # Validate required fields
        if not all([boat_id, start_date_str, end_date_str]):
            return JsonResponse({
                'success': False,
                'message': 'boat_id, start_date, and end_date are required'
            }, status=400)
        
        # Parse dates
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid date format. Use YYYY-MM-DD'
            }, status=400)
        
        # Validate date logic
        if start_date > end_date:
            return JsonResponse({
                'success': False,
                'message': 'Start date must be before or equal to end date'
            }, status=400)
        
        if start_date < date.today():
            return JsonResponse({
                'success': False,
                'message': 'Cannot book dates in the past'
            }, status=400)
        
        # Get boat and user
        try:
            boat = Boat.objects.get(id=boat_id, is_active=True)
        except Boat.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Boat not found'
            }, status=404)
        
        try:
            user = User.objects.get(phone=user_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        # Check ownership - Task 4 requirement
        try:
            ownership = FractionalOwnership.objects.get(boat=boat, owner=user, is_active=True)
        except FractionalOwnership.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'You do not own shares in this yacht'
            }, status=403)
        
        # Calculate booking duration
        duration_days = (end_date - start_date).days + 1
        
        # Rules validation - Task 4 Rules v1
        
        # Rule 1: Check annual day limit (48 days per share)
        if ownership.current_year_days_used + duration_days > ownership.annual_day_limit:
            return JsonResponse({
                'success': False,
                'message': f'Booking exceeds annual day limit. Used: {ownership.current_year_days_used}/{ownership.annual_day_limit} days',
                'rule_violation': 'annual_day_limit'
            }, status=400)
        
        # Rule 2: Check for conflicting bookings
        conflicting_bookings = Booking.objects.filter(
            boat=boat,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['confirmed', 'pending']
        ).exclude(user=user)
        
        if conflicting_bookings.exists():
            return JsonResponse({
                'success': False,
                'message': f'Boat is already booked during this period',
                'rule_violation': 'booking_conflict'
            }, status=400)
        
        # Rule 3: Check guest capacity
        if guest_count > boat.capacity:
            return JsonResponse({
                'success': False,
                'message': f'Guest count ({guest_count}) exceeds boat capacity ({boat.capacity})',
                'rule_violation': 'capacity_exceeded'
            }, status=400)
        
        # Rule 4: Apply booking rules (seasonal multipliers, advance booking, etc.)
        active_rules = BookingRule.objects.filter(
            boat=boat,
            is_active=True,
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        # Check advance booking requirements
        for rule in active_rules.filter(rule_type='advance_booking'):
            if rule.days_requirement:
                required_advance_days = rule.days_requirement
                advance_days = (start_date - date.today()).days
                if advance_days < required_advance_days:
                    return JsonResponse({
                        'success': False,
                        'message': f'Booking requires {required_advance_days} days advance notice',
                        'rule_violation': 'advance_booking_required'
                    }, status=400)
        
        # Check minimum stay requirements
        for rule in active_rules.filter(rule_type='minimum_stay'):
            if rule.days_requirement and duration_days < rule.days_requirement:
                return JsonResponse({
                    'success': False,
                    'message': f'Minimum stay requirement: {rule.days_requirement} days',
                    'rule_violation': 'minimum_stay_required'
                }, status=400)
        
        # Check fuel wallet balance (Task 4 prep for later tasks)
        fuel_wallet, created = FuelWallet.objects.get_or_create(
            owner=user,
            defaults={'current_balance': Decimal('1000.00')}  # Demo balance
        )
        
        if fuel_wallet.is_low_balance:
            logger.warning(f"Low fuel balance for user {user.phone}: ${fuel_wallet.current_balance}")
        
        # Calculate total amount with seasonal multipliers
        daily_rate = boat.daily_rate
        total_amount = daily_rate * duration_days
        
        # Apply seasonal multipliers
        for rule in active_rules.filter(rule_type='seasonal_multiplier'):
            if rule.multiplier_value:
                total_amount = total_amount * rule.multiplier_value
                logger.info(f"Applied seasonal multiplier {rule.multiplier_value} for rule: {rule.rule_name}")
        
        # Create the booking
        booking = Booking.objects.create(
            boat=boat,
            user=user,
            booking_type='owner',
            status='confirmed',  # Owner bookings are auto-confirmed
            start_date=start_date,
            end_date=end_date,
            guest_count=guest_count,
            total_amount=total_amount,
            notes=notes
        )
        
        # Update ownership usage
        ownership.current_year_days_used += duration_days
        ownership.save()
        
        logger.info(f"Owner booking created: {booking.id} for {user.phone}")
        
        return JsonResponse({
            'success': True,
            'booking': {
                'id': booking.id,
                'boat': {
                    'id': boat.id,
                    'name': boat.name,
                    'model': boat.model,
                    'location': boat.location,
                },
                'booking_type': booking.booking_type,
                'status': booking.status,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'guest_count': booking.guest_count,
                'total_amount': str(booking.total_amount),
                'duration_days': booking.duration_days,
                'notes': booking.notes,
                'created_at': booking.created_at.isoformat(),
            },
            'ownership_usage': {
                'days_used': ownership.current_year_days_used,
                'days_limit': ownership.annual_day_limit,
                'remaining_days': ownership.remaining_days,
            },
            'fuel_wallet': {
                'balance': str(fuel_wallet.current_balance),
                'is_low_balance': fuel_wallet.is_low_balance,
            }
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating owner booking: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to create booking'
        }, status=500)

@require_http_methods(["GET"])
def check_booking_rules(request, boat_id):
    """
    Check booking rules for a specific boat and date range
    GET /boats/{boat_id}/booking-rules/?start_date=2025-09-15&end_date=2025-09-17&user_phone=+123456
    """
    try:
        boat = Boat.objects.get(id=boat_id, is_active=True)
        
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        user_phone = request.GET.get('user_phone', '+201234567890')
        
        if not start_date_str or not end_date_str:
            return JsonResponse({
                'error': 'start_date and end_date query parameters are required'
            }, status=400)
        
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        
        # Get user and ownership
        try:
            user = User.objects.get(phone=user_phone)
            ownership = FractionalOwnership.objects.get(boat=boat, owner=user, is_active=True)
        except (User.DoesNotExist, FractionalOwnership.DoesNotExist):
            return JsonResponse({
                'can_book': False,
                'message': 'User does not own shares in this yacht'
            })
        
        # Check all rules
        duration_days = (end_date - start_date).days + 1
        rules_check = {
            'can_book': True,
            'violations': [],
            'warnings': [],
            'rules_applied': [],
        }
        
        # Check day limit
        if ownership.current_year_days_used + duration_days > ownership.annual_day_limit:
            rules_check['can_book'] = False
            rules_check['violations'].append({
                'rule': 'annual_day_limit',
                'message': f'Exceeds annual day limit: {ownership.current_year_days_used + duration_days}/{ownership.annual_day_limit}'
            })
        
        # Check conflicts
        conflicts = Booking.objects.filter(
            boat=boat,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['confirmed', 'pending']
        ).exclude(user=user)
        
        if conflicts.exists():
            rules_check['can_book'] = False
            rules_check['violations'].append({
                'rule': 'booking_conflict',
                'message': 'Boat already booked during this period'
            })
        
        # Check active booking rules
        active_rules = BookingRule.objects.filter(
            boat=boat,
            is_active=True,
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        for rule in active_rules:
            rules_check['rules_applied'].append({
                'rule_type': rule.rule_type,
                'rule_name': rule.rule_name,
                'description': rule.rule_description,
            })
        
        # Check fuel wallet
        try:
            fuel_wallet = FuelWallet.objects.get(owner=user)
            if fuel_wallet.is_low_balance:
                rules_check['warnings'].append({
                    'type': 'low_fuel_balance',
                    'message': f'Low fuel balance: ${fuel_wallet.current_balance}'
                })
        except FuelWallet.DoesNotExist:
            rules_check['warnings'].append({
                'type': 'no_fuel_wallet',
                'message': 'No fuel wallet found - one will be created'
            })
        
        return JsonResponse(rules_check)
        
    except Boat.DoesNotExist:
        return JsonResponse({'error': 'Boat not found'}, status=404)
    except ValueError:
        return JsonResponse({'error': 'Invalid date format'}, status=400)
    except Exception as e:
        logger.error(f"Error checking booking rules: {e}")
        return JsonResponse({'error': 'Failed to check rules'}, status=500)