"""
Task 5 - Visitor Rental Booking (Pending) Views
API endpoints for visitor rental bookings without payment processing
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
from ownership.models import BookingRule
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def create_visitor_rental(request):
    """
    Task 5 - Create visitor rental booking (pending payment)
    POST /bookings/rental/
    Body: {"boat_id": 1, "start_date": "2025-09-20", "end_date": "2025-09-21", "guest_count": 8, "contact_phone": "+1234567890"}
    """
    try:
        data = json.loads(request.body)
        
        # Extract booking data
        boat_id = data.get('boat_id')
        contact_phone = data.get('contact_phone')
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        guest_count = data.get('guest_count', 1)
        notes = data.get('notes', '')
        
        # Validate required fields
        if not all([boat_id, contact_phone, start_date_str, end_date_str]):
            return JsonResponse({
                'success': False,
                'message': 'boat_id, contact_phone, start_date, and end_date are required'
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
        
        # Get boat
        try:
            boat = Boat.objects.get(id=boat_id, is_active=True, allow_public_rental=True)
        except Boat.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Boat not found or not available for public rental'
            }, status=404)
        
        # Get or create visitor user
        visitor_user, created = User.objects.get_or_create(
            phone=contact_phone,
            defaults={
                'is_phone_verified': False,  # Visitors don't need phone verification for rentals
            }
        )
        
        # Calculate booking duration
        duration_days = (end_date - start_date).days + 1
        
        # Rental booking validations - Task 5
        
        # Rule 1: Check for conflicting bookings (both owner and rental)
        conflicting_bookings = Booking.objects.filter(
            boat=boat,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['confirmed', 'pending']
        )
        
        if conflicting_bookings.exists():
            return JsonResponse({
                'success': False,
                'message': f'Boat is already booked during this period',
                'rule_violation': 'booking_conflict'
            }, status=400)
        
        # Rule 2: Check guest capacity
        if guest_count > boat.capacity:
            return JsonResponse({
                'success': False,
                'message': f'Guest count ({guest_count}) exceeds boat capacity ({boat.capacity})',
                'rule_violation': 'capacity_exceeded'
            }, status=400)
        
        # Rule 3: Apply booking rules for rentals
        active_rules = BookingRule.objects.filter(
            boat=boat,
            is_active=True,
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        # Check minimum stay requirements
        for rule in active_rules.filter(rule_type='minimum_stay'):
            if rule.days_requirement and duration_days < rule.days_requirement:
                return JsonResponse({
                    'success': False,
                    'message': f'Minimum stay requirement: {rule.days_requirement} days',
                    'rule_violation': 'minimum_stay_required'
                }, status=400)
        
        # Calculate total amount with seasonal multipliers
        daily_rate = boat.daily_rate
        total_amount = daily_rate * duration_days
        
        # Apply seasonal multipliers
        applied_multipliers = []
        for rule in active_rules.filter(rule_type='seasonal_multiplier'):
            if rule.multiplier_value:
                total_amount = total_amount * rule.multiplier_value
                applied_multipliers.append({
                    'rule_name': rule.rule_name,
                    'multiplier': float(rule.multiplier_value)
                })
                logger.info(f"Applied seasonal multiplier {rule.multiplier_value} for rule: {rule.rule_name}")
        
        # Create the rental booking (pending payment)
        booking = Booking.objects.create(
            boat=boat,
            user=visitor_user,
            booking_type='rental',
            status='pending',  # Pending until payment confirmation (Task 7)
            start_date=start_date,
            end_date=end_date,
            guest_count=guest_count,
            total_amount=total_amount,
            notes=notes
        )
        
        logger.info(f"Visitor rental booking created: {booking.id} for {contact_phone}")
        
        return JsonResponse({
            'success': True,
            'booking': {
                'id': booking.id,
                'boat': {
                    'id': boat.id,
                    'name': boat.name,
                    'model': boat.model,
                    'location': boat.location,
                    'daily_rate': str(boat.daily_rate),
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
                'contact_phone': visitor_user.phone,
            },
            'pricing_breakdown': {
                'daily_rate': str(daily_rate),
                'duration_days': duration_days,
                'base_amount': str(daily_rate * duration_days),
                'applied_multipliers': applied_multipliers,
                'final_amount': str(total_amount),
            },
            'next_step': 'payment_required',
            'payment_message': f'Booking created successfully. Payment of ${total_amount} required to confirm reservation.'
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating visitor rental booking: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to create rental booking'
        }, status=500)

@require_http_methods(["GET"])
def get_rental_quote(request, boat_id):
    """
    Get rental quote for visitor booking
    GET /boats/{boat_id}/rental-quote/?start_date=2025-09-20&end_date=2025-09-21&guest_count=8
    """
    try:
        boat = Boat.objects.get(id=boat_id, is_active=True, allow_public_rental=True)
        
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        guest_count = int(request.GET.get('guest_count', 1))
        
        if not start_date_str or not end_date_str:
            return JsonResponse({
                'error': 'start_date and end_date query parameters are required'
            }, status=400)
        
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        duration_days = (end_date - start_date).days + 1
        
        # Check availability
        conflicts = Booking.objects.filter(
            boat=boat,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=['confirmed', 'pending']
        )
        
        if conflicts.exists():
            return JsonResponse({
                'available': False,
                'message': 'Boat not available during requested dates'
            })
        
        # Check capacity
        if guest_count > boat.capacity:
            return JsonResponse({
                'available': False,
                'message': f'Guest count exceeds boat capacity ({boat.capacity})'
            })
        
        # Calculate pricing with rules
        daily_rate = boat.daily_rate
        base_amount = daily_rate * duration_days
        total_amount = base_amount
        
        active_rules = BookingRule.objects.filter(
            boat=boat,
            is_active=True,
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        applied_multipliers = []
        for rule in active_rules.filter(rule_type='seasonal_multiplier'):
            if rule.multiplier_value:
                total_amount = total_amount * rule.multiplier_value
                applied_multipliers.append({
                    'rule_name': rule.rule_name,
                    'description': rule.rule_description,
                    'multiplier': float(rule.multiplier_value)
                })
        
        # Check minimum stay requirements
        minimum_stay_violations = []
        for rule in active_rules.filter(rule_type='minimum_stay'):
            if rule.days_requirement and duration_days < rule.days_requirement:
                minimum_stay_violations.append({
                    'rule_name': rule.rule_name,
                    'required_days': rule.days_requirement
                })
        
        return JsonResponse({
            'available': len(minimum_stay_violations) == 0,
            'boat': {
                'id': boat.id,
                'name': boat.name,
                'model': boat.model,
                'location': boat.location,
                'capacity': boat.capacity,
            },
            'quote': {
                'daily_rate': str(daily_rate),
                'duration_days': duration_days,
                'base_amount': str(base_amount),
                'applied_multipliers': applied_multipliers,
                'total_amount': str(total_amount),
            },
            'booking_requirements': {
                'minimum_stay_violations': minimum_stay_violations,
            }
        })
        
    except Boat.DoesNotExist:
        return JsonResponse({'error': 'Boat not found'}, status=404)
    except ValueError:
        return JsonResponse({'error': 'Invalid date format or guest count'}, status=400)
    except Exception as e:
        logger.error(f"Error getting rental quote: {e}")
        return JsonResponse({'error': 'Failed to get quote'}, status=500)