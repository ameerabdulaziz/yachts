"""
Task 11 - Enforce Fuel Threshold on Owner Booking Views
Enhanced owner booking system with fuel balance validation
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
from payment_system.models import FuelTransaction
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def create_owner_booking_with_fuel_check(request):
    """
    Task 11 - Enhanced owner booking with fuel threshold validation
    POST /bookings/owner-enhanced/
    Body: {
        "user_phone": "+201234567890", 
        "boat_id": 1, 
        "start_date": "2025-09-15", 
        "end_date": "2025-09-17",
        "guest_count": 6,
        "estimated_engine_hours": 12.5,
        "notes": "Weekend trip"
    }
    """
    try:
        data = json.loads(request.body)
        
        # Extract booking data
        user_phone = data.get('user_phone', '+201234567890')
        boat_id = data.get('boat_id')
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        guest_count = data.get('guest_count', 1)
        estimated_engine_hours = data.get('estimated_engine_hours', 0)
        notes = data.get('notes', '')
        
        # Validate required fields
        if not all([boat_id, start_date_str, end_date_str]):
            return JsonResponse({
                'success': False,
                'message': 'boat_id, start_date, and end_date are required'
            }, status=400)
        
        # Parse dates and engine hours
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            estimated_engine_hours = Decimal(str(estimated_engine_hours))
        except ValueError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid date format or engine hours. Use YYYY-MM-DD for dates'
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
        
        # Get user and boat
        try:
            user = User.objects.get(phone=user_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'User not found'
            }, status=404)
        
        try:
            boat = Boat.objects.get(id=boat_id, is_active=True)
        except Boat.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Boat not found or not active'
            }, status=404)
        
        # Check fractional ownership
        ownership = FractionalOwnership.objects.filter(
            boat=boat,
            owner=user,
            is_active=True
        ).first()
        
        if not ownership:
            return JsonResponse({
                'success': False,
                'message': 'User does not have ownership rights for this boat',
                'rule_violation': 'no_ownership'
            }, status=403)
        
        # Calculate booking duration
        duration_days = (end_date - start_date).days + 1
        
        # ==== TASK 11 CORE REQUIREMENT: FUEL THRESHOLD CHECK ====
        
        # Get or create fuel wallet
        fuel_wallet, created = FuelWallet.objects.get_or_create(
            owner=user,
            defaults={
                'current_balance': Decimal('0.00'),
                'total_purchased': Decimal('0.00'),
                'total_consumed': Decimal('0.00'),
                'low_balance_threshold': Decimal('200.00'),  # Default threshold
                'auto_topup_enabled': False,
                'auto_topup_amount': Decimal('500.00'),
            }
        )
        
        # Calculate estimated fuel cost based on engine hours and boat fuel consumption rate
        # Assume fuel consumption rate of ~$15-25 per engine hour for De Antonio yachts
        fuel_rate_per_hour = Decimal('20.00')  # Average rate
        if boat.model.startswith('D6'):  # Larger boats consume more
            fuel_rate_per_hour = Decimal('35.00')
        elif boat.model.startswith('D5'):
            fuel_rate_per_hour = Decimal('30.00')
        elif boat.model.startswith('D4'):
            fuel_rate_per_hour = Decimal('25.00')
        elif boat.model.startswith('D3'):
            fuel_rate_per_hour = Decimal('20.00')
        elif boat.model.startswith('D2'):
            fuel_rate_per_hour = Decimal('15.00')
        
        estimated_fuel_cost = estimated_engine_hours * fuel_rate_per_hour
        
        # Add safety buffer (20% additional fuel requirement)
        fuel_buffer_multiplier = Decimal('1.2')
        required_fuel_balance = estimated_fuel_cost * fuel_buffer_multiplier
        
        # FUEL THRESHOLD VALIDATION - Task 11 core check
        fuel_check_result = {
            'current_balance': fuel_wallet.current_balance,
            'estimated_fuel_cost': estimated_fuel_cost,
            'required_balance': required_fuel_balance,
            'safety_buffer': estimated_fuel_cost * (fuel_buffer_multiplier - 1),
            'sufficient_fuel': fuel_wallet.current_balance >= required_fuel_balance,
            'fuel_deficit': max(Decimal('0'), required_fuel_balance - fuel_wallet.current_balance),
        }
        
        if not fuel_check_result['sufficient_fuel']:
            return JsonResponse({
                'success': False,
                'message': f'Insufficient fuel balance for this booking',
                'rule_violation': 'insufficient_fuel',
                'fuel_analysis': {
                    'current_balance': str(fuel_check_result['current_balance']),
                    'required_balance': str(fuel_check_result['required_balance']),
                    'fuel_deficit': str(fuel_check_result['fuel_deficit']),
                    'estimated_cost': str(fuel_check_result['estimated_fuel_cost']),
                    'safety_buffer': str(fuel_check_result['safety_buffer']),
                    'estimated_engine_hours': str(estimated_engine_hours),
                    'fuel_rate_per_hour': str(fuel_rate_per_hour),
                },
                'recommendations': [
                    f'Top up your fuel wallet with at least ${fuel_check_result["fuel_deficit"]}',
                    'Consider enabling auto top-up to avoid future booking issues',
                    'Reduce estimated engine hours if trip duration allows'
                ]
            }, status=400)
        
        # Continue with existing owner booking validations from Task 4
        
        # Rule 1: Check for conflicting bookings
        conflicting_bookings = Booking.objects.filter(
            boat=boat,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['confirmed', 'pending']
        )
        
        if conflicting_bookings.exists():
            conflicting = conflicting_bookings.first()
            return JsonResponse({
                'success': False,
                'message': f'Boat is already booked during this period',
                'rule_violation': 'booking_conflict',
                'conflicting_booking': {
                    'id': conflicting.id,
                    'dates': f'{conflicting.start_date} to {conflicting.end_date}',
                    'type': conflicting.booking_type
                }
            }, status=400)
        
        # Rule 2: Check capacity
        if guest_count > boat.capacity:
            return JsonResponse({
                'success': False,
                'message': f'Guest count ({guest_count}) exceeds boat capacity ({boat.capacity})',
                'rule_violation': 'capacity_exceeded'
            }, status=400)
        
        # Rule 3: Check annual day usage limit (48 days default per share)
        current_year = start_date.year
        year_start = date(current_year, 1, 1)
        year_end = date(current_year, 12, 31)
        
        existing_bookings_this_year = Booking.objects.filter(
            boat=boat,
            user=user,
            booking_type='owner',
            status__in=['confirmed', 'pending'],
            start_date__gte=year_start,
            end_date__lte=year_end
        ).exclude(start_date__gte=start_date, end_date__lte=end_date)
        
        total_days_used = sum(
            (booking.end_date - booking.start_date).days + 1 
            for booking in existing_bookings_this_year
        )
        
        max_days_allowed = ownership.annual_day_limit
        days_after_booking = total_days_used + duration_days
        
        if days_after_booking > max_days_allowed:
            return JsonResponse({
                'success': False,
                'message': f'Booking would exceed annual usage limit',
                'rule_violation': 'usage_limit_exceeded',
                'usage_analysis': {
                    'share_percentage': ownership.share_percentage,
                    'max_days_allowed': max_days_allowed,
                    'days_used_this_year': total_days_used,
                    'requested_days': duration_days,
                    'total_after_booking': days_after_booking,
                    'days_over_limit': days_after_booking - max_days_allowed
                }
            }, status=400)
        
        # Rule 4: Apply booking rules for owners
        active_rules = BookingRule.objects.filter(
            boat=boat,
            is_active=True,
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        # Check advance booking requirements
        days_in_advance = (start_date - date.today()).days
        for rule in active_rules.filter(rule_type='advance_booking'):
            if rule.days_requirement and days_in_advance < rule.days_requirement:
                return JsonResponse({
                    'success': False,
                    'message': f'Advance booking requirement: {rule.days_requirement} days minimum',
                    'rule_violation': 'advance_booking_required',
                    'days_in_advance': days_in_advance,
                    'required_days': rule.days_requirement
                }, status=400)
        
        # Check minimum stay requirements
        for rule in active_rules.filter(rule_type='minimum_stay'):
            if rule.days_requirement and duration_days < rule.days_requirement:
                return JsonResponse({
                    'success': False,
                    'message': f'Minimum stay requirement: {rule.days_requirement} days',
                    'rule_violation': 'minimum_stay_required',
                    'requested_days': duration_days,
                    'required_days': rule.days_requirement
                }, status=400)
        
        # Create the owner booking - Task 11 success path
        booking = Booking.objects.create(
            boat=boat,
            user=user,
            booking_type='owner',
            status='confirmed',  # Owner bookings are automatically confirmed
            start_date=start_date,
            end_date=end_date,
            guest_count=guest_count,
            total_amount=Decimal('0.00'),  # No payment required for owners
            notes=notes
        )
        
        logger.info(f"Enhanced owner booking created with fuel check: {booking.id} for {user_phone}")
        
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
                'ownership': {
                    'share_percentage': ownership.share_percentage,
                    'annual_day_limit': ownership.annual_day_limit,
                },
                'booking_type': booking.booking_type,
                'status': booking.status,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'guest_count': booking.guest_count,
                'duration_days': booking.duration_days,
                'notes': booking.notes,
                'created_at': booking.created_at.isoformat(),
            },
            'fuel_analysis': {
                'current_balance': str(fuel_check_result['current_balance']),
                'estimated_fuel_cost': str(fuel_check_result['estimated_fuel_cost']),
                'required_balance': str(fuel_check_result['required_balance']),
                'safety_buffer': str(fuel_check_result['safety_buffer']),
                'balance_after_trip': str(fuel_wallet.current_balance - estimated_fuel_cost),
                'estimated_engine_hours': str(estimated_engine_hours),
                'fuel_rate_per_hour': str(fuel_rate_per_hour),
            },
            'usage_analysis': {
                'share_percentage': ownership.share_percentage,
                'max_days_allowed': max_days_allowed,
                'days_used_this_year': total_days_used,
                'days_remaining': max_days_allowed - total_days_used - duration_days,
            },
            'message': 'Owner booking confirmed with sufficient fuel balance'
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating enhanced owner booking: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to create owner booking'
        }, status=500)

@require_http_methods(["GET"])
def check_owner_booking_eligibility(request, boat_id):
    """
    Check owner booking eligibility with fuel analysis
    GET /boats/{boat_id}/owner-eligibility/?user_phone=+201234567890&start_date=2025-09-15&end_date=2025-09-17&estimated_engine_hours=12
    """
    try:
        user_phone = request.GET.get('user_phone', '+201234567890')
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        estimated_engine_hours = Decimal(str(request.GET.get('estimated_engine_hours', 0)))
        
        if not all([start_date_str, end_date_str]):
            return JsonResponse({
                'error': 'start_date and end_date query parameters are required'
            }, status=400)
        
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        duration_days = (end_date - start_date).days + 1
        
        # Get user, boat, and ownership
        try:
            user = User.objects.get(phone=user_phone)
            boat = Boat.objects.get(id=boat_id, is_active=True)
            ownership = FractionalOwnership.objects.get(boat=boat, owner=user, is_active=True)
        except (User.DoesNotExist, Boat.DoesNotExist, FractionalOwnership.DoesNotExist) as e:
            return JsonResponse({
                'eligible': False,
                'reason': 'User does not have ownership rights for this boat'
            })
        
        # Get fuel wallet
        fuel_wallet, created = FuelWallet.objects.get_or_create(
            owner=user,
            defaults={
                'current_balance': Decimal('0.00'),
                'total_purchased': Decimal('0.00'),
                'total_consumed': Decimal('0.00'),
                'low_balance_threshold': Decimal('200.00'),
            }
        )
        
        # Calculate fuel requirements
        fuel_rate_per_hour = Decimal('20.00')
        if boat.model.startswith('D6'):
            fuel_rate_per_hour = Decimal('35.00')
        elif boat.model.startswith('D5'):
            fuel_rate_per_hour = Decimal('30.00')
        elif boat.model.startswith('D4'):
            fuel_rate_per_hour = Decimal('25.00')
        
        estimated_fuel_cost = estimated_engine_hours * fuel_rate_per_hour
        required_balance = estimated_fuel_cost * Decimal('1.2')  # 20% safety buffer
        
        # Check all eligibility criteria
        eligibility_checks = []
        
        # Fuel check - Task 11
        fuel_sufficient = fuel_wallet.current_balance >= required_balance
        eligibility_checks.append({
            'check': 'fuel_balance',
            'passed': fuel_sufficient,
            'message': 'Sufficient fuel balance' if fuel_sufficient else f'Insufficient fuel balance (need ${required_balance - fuel_wallet.current_balance:.2f} more)',
            'details': {
                'current_balance': str(fuel_wallet.current_balance),
                'required_balance': str(required_balance),
                'estimated_cost': str(estimated_fuel_cost),
            }
        })
        
        # Booking conflicts
        conflicts = Booking.objects.filter(
            boat=boat,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['confirmed', 'pending']
        )
        no_conflicts = not conflicts.exists()
        eligibility_checks.append({
            'check': 'booking_conflicts',
            'passed': no_conflicts,
            'message': 'No booking conflicts' if no_conflicts else 'Booking conflicts exist',
        })
        
        # Usage limits
        current_year = start_date.year
        year_bookings = Booking.objects.filter(
            boat=boat,
            user=user,
            booking_type='owner',
            status__in=['confirmed', 'pending'],
            start_date__year=current_year
        )
        
        total_days_used = sum((b.end_date - b.start_date).days + 1 for b in year_bookings)
        max_days_allowed = ownership.annual_day_limit
        usage_ok = (total_days_used + duration_days) <= max_days_allowed
        
        eligibility_checks.append({
            'check': 'usage_limits',
            'passed': usage_ok,
            'message': 'Within usage limits' if usage_ok else 'Would exceed annual usage limit',
            'details': {
                'days_used': total_days_used,
                'max_days': max_days_allowed,
                'requested_days': duration_days,
                'days_remaining': max(0, max_days_allowed - total_days_used)
            }
        })
        
        # Overall eligibility
        overall_eligible = all(check['passed'] for check in eligibility_checks)
        
        return JsonResponse({
            'eligible': overall_eligible,
            'boat': {
                'id': boat.id,
                'name': boat.name,
                'model': boat.model,
            },
            'ownership': {
                'share_percentage': ownership.share_percentage,
                'annual_day_limit': ownership.annual_day_limit,
            },
            'fuel_analysis': {
                'current_balance': str(fuel_wallet.current_balance),
                'estimated_fuel_cost': str(estimated_fuel_cost),
                'required_balance': str(required_balance),
                'fuel_rate_per_hour': str(fuel_rate_per_hour),
                'estimated_engine_hours': str(estimated_engine_hours),
                'sufficient_fuel': fuel_sufficient,
            },
            'eligibility_checks': eligibility_checks,
            'recommendations': [
                f'Top up fuel wallet if balance is low (current: ${fuel_wallet.current_balance})',
                'Check for booking conflicts on selected dates',
                f'Monitor annual usage (used {total_days_used}/{max_days_allowed} days)',
            ] if not overall_eligible else ['All requirements met - ready to book']
        })
        
    except ValueError:
        return JsonResponse({'error': 'Invalid date format or engine hours'}, status=400)
    except Exception as e:
        logger.error(f"Error checking owner booking eligibility: {e}")
        return JsonResponse({'error': 'Failed to check eligibility'}, status=500)