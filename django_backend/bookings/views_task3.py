"""
Task 3 - Owner Calendar (Read) Views
API endpoints for reading calendar and booking data
"""
import json
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from .models import Booking, CalendarEvent
from boats.models import Boat
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@require_http_methods(["GET"])
def boat_calendar(request, boat_id):
    """
    Task 3 - Get calendar for specific boat
    GET /boats/{boat_id}/calendar/
    Query params: start_date, end_date (optional)
    Returns: Array of calendar events and bookings
    """
    try:
        boat = Boat.objects.get(id=boat_id, is_active=True)
        
        # Get date range from query parameters
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        
        # Default to current month if no dates provided
        if not start_date_str:
            start_date = datetime.now().date().replace(day=1)
        else:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        
        if not end_date_str:
            # End of current month
            next_month = start_date.replace(day=28) + timedelta(days=4)
            end_date = (next_month - timedelta(days=next_month.day)).replace(day=1) + timedelta(days=31)
            end_date = end_date.replace(day=1) - timedelta(days=1)
        else:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        
        # Get bookings for the date range
        bookings = Booking.objects.filter(
            boat=boat,
            start_date__lte=end_date,
            end_date__gte=start_date
        ).select_related('user')
        
        # Get calendar events for the date range
        calendar_events = CalendarEvent.objects.filter(
            boat=boat,
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        # Format booking data
        booking_data = []
        for booking in bookings:
            booking_data.append({
                'id': booking.id,
                'type': 'booking',
                'booking_type': booking.booking_type,
                'status': booking.status,
                'title': f"{booking.booking_type.title()} - {booking.user.phone}",
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'start_time': booking.start_time.isoformat() if booking.start_time else None,
                'end_time': booking.end_time.isoformat() if booking.end_time else None,
                'guest_count': booking.guest_count,
                'total_amount': str(booking.total_amount) if booking.total_amount else None,
                'user_phone': booking.user.phone,
                'notes': booking.notes,
                'duration_days': booking.duration_days,
            })
        
        # Format calendar events data
        events_data = []
        for event in calendar_events:
            events_data.append({
                'id': event.id,
                'type': 'event',
                'event_type': event.event_type,
                'title': event.title,
                'description': event.description,
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'start_time': event.start_time.isoformat() if event.start_time else None,
                'end_time': event.end_time.isoformat() if event.end_time else None,
            })
        
        # Combine all calendar items
        calendar_data = {
            'boat': {
                'id': boat.id,
                'name': boat.name,
                'model': boat.model,
                'location': boat.location,
            },
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
            },
            'bookings': booking_data,
            'events': events_data,
            'total_bookings': len(booking_data),
            'total_events': len(events_data),
        }
        
        logger.info(f"Calendar fetched for boat {boat_id}: {len(booking_data)} bookings, {len(events_data)} events")
        
        return JsonResponse(calendar_data)
        
    except Boat.DoesNotExist:
        return JsonResponse({
            'error': 'Boat not found'
        }, status=404)
    except ValueError as e:
        return JsonResponse({
            'error': f'Invalid date format: {str(e)}'
        }, status=400)
    except Exception as e:
        logger.error(f"Error fetching calendar for boat {boat_id}: {e}")
        return JsonResponse({
            'error': 'Failed to fetch calendar'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def user_bookings(request):
    """
    Handle bookings for authenticated user
    GET /bookings/ - Get user bookings with optional filtering
    POST /bookings/ - Create new booking
    """
    if request.method == "POST":
        return create_booking(request)
    
    # GET request handling
    try:
        # Demo mode - get user by phone from query parameter
        user_phone = request.GET.get('user_phone', '+201234567890')
        
        try:
            user = User.objects.get(phone=user_phone)
        except User.DoesNotExist:
            return JsonResponse({
                'bookings': [],
                'message': 'No user found with this phone number'
            })
        
        # Filter parameters
        status = request.GET.get('status')
        boat_id = request.GET.get('boat_id')
        
        bookings_query = Booking.objects.filter(user=user).select_related('boat')
        
        if status:
            bookings_query = bookings_query.filter(status=status)
        if boat_id:
            bookings_query = bookings_query.filter(boat_id=boat_id)
        
        bookings = bookings_query.order_by('-start_date')
        
        bookings_data = []
        for booking in bookings:
            bookings_data.append({
                'id': booking.id,
                'boat': {
                    'id': booking.boat.id,
                    'name': booking.boat.name,
                    'model': booking.boat.model,
                    'location': booking.boat.location,
                },
                'booking_type': booking.booking_type,
                'status': booking.status,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'start_time': booking.start_time.isoformat() if booking.start_time else None,
                'end_time': booking.end_time.isoformat() if booking.end_time else None,
                'guest_count': booking.guest_count,
                'total_amount': str(booking.total_amount) if booking.total_amount else None,
                'notes': booking.notes,
                'duration_days': booking.duration_days,
                'created_at': booking.created_at.isoformat(),
            })
        
        return JsonResponse({
            'bookings': bookings_data,
            'total_count': len(bookings_data),
            'user_phone': user_phone,
        })
        
    except Exception as e:
        logger.error(f"Error fetching user bookings: {e}")
        return JsonResponse({
            'error': 'Failed to fetch bookings'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def list_bookings(request):
    """
    List all bookings with optional filtering
    GET /bookings/list/?status=confirmed&boat_id=1
    Returns: Array of all bookings with filtering options
    """
    try:
        # Get query parameters for filtering
        status = request.GET.get('status')
        boat_id = request.GET.get('boat_id')
        user_phone = request.GET.get('user_phone')
        
        # Base query
        bookings_query = Booking.objects.all().select_related('boat', 'user')
        
        # Apply filters
        if status:
            bookings_query = bookings_query.filter(status=status)
        if boat_id:
            bookings_query = bookings_query.filter(boat_id=boat_id)
        if user_phone:
            bookings_query = bookings_query.filter(user__phone=user_phone)
        
        bookings = bookings_query.order_by('-created_at')
        
        bookings_data = []
        for booking in bookings:
            bookings_data.append({
                'id': booking.id,
                'boat': {
                    'id': booking.boat.id,
                    'name': booking.boat.name,
                    'model': booking.boat.model,
                    'location': booking.boat.location,
                },
                'user': {
                    'phone': booking.user.phone,
                    'first_name': booking.user.first_name,
                    'last_name': booking.user.last_name,
                },
                'booking_type': booking.booking_type,
                'status': booking.status,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'start_time': booking.start_time.isoformat() if booking.start_time else None,
                'end_time': booking.end_time.isoformat() if booking.end_time else None,
                'guest_count': booking.guest_count,
                'total_amount': str(booking.total_amount) if booking.total_amount else None,
                'duration_days': booking.duration_days,
                'notes': booking.notes,
                'created_at': booking.created_at.isoformat(),
            })
        
        return JsonResponse({
            'bookings': bookings_data,
            'total_count': len(bookings_data),
            'filters': {
                'status': status,
                'boat_id': boat_id,
                'user_phone': user_phone,
            }
        })
        
    except Exception as e:
        logger.error(f"Error listing bookings: {e}")
        return JsonResponse({
            'error': 'Failed to list bookings'
        }, status=500)

def create_booking(request):
    """
    Create a new booking
    POST /bookings/
    Body: {"boat_id": 1, "start_date": "2025-09-15", "end_date": "2025-09-17", "booking_type": "rental", "guest_count": 4}
    """
    try:
        data = json.loads(request.body)
        
        # Extract booking data
        boat_id = data.get('boat_id')
        user_phone = data.get('user_phone', '+201234567890')  # Demo mode
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        booking_type = data.get('booking_type', 'rental')
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
        
        if start_date >= end_date:
            return JsonResponse({
                'success': False,
                'message': 'start_date must be before end_date'
            }, status=400)
        
        # Get boat and user
        from boats.models import Boat
        try:
            boat = Boat.objects.get(id=boat_id, is_active=True)
            user, created = User.objects.get_or_create(
                phone=user_phone,
                defaults={
                    'first_name': 'Demo',
                    'last_name': 'User',
                    'email': f'demo{user_phone[-4:]}@nauttec.com'
                }
            )
        except Boat.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Boat not found'
            }, status=404)
        
        # Check for conflicts
        conflicting_bookings = Booking.objects.filter(
            boat=boat,
            status__in=['confirmed', 'pending'],
            start_date__lt=end_date,
            end_date__gt=start_date
        )
        
        if conflicting_bookings.exists():
            return JsonResponse({
                'success': False,
                'message': 'Boat is not available for the selected dates',
                'conflicting_bookings': [
                    {
                        'id': b.id,
                        'start_date': b.start_date.isoformat(),
                        'end_date': b.end_date.isoformat(),
                        'status': b.status
                    } for b in conflicting_bookings
                ]
            }, status=400)
        
        # Calculate duration and amount
        duration_days = (end_date - start_date).days
        total_amount = boat.daily_rate * duration_days if boat.daily_rate else None
        
        # Create booking
        booking = Booking.objects.create(
            boat=boat,
            user=user,
            booking_type=booking_type,
            start_date=start_date,
            end_date=end_date,
            guest_count=guest_count,
            status='pending',
            total_amount=total_amount,
            notes=notes
        )
        
        logger.info(f"Booking created: {booking.id} for boat {boat_id} by {user_phone}")
        
        return JsonResponse({
            'success': True,
            'message': 'Booking created successfully',
            'booking': {
                'id': booking.id,
                'boat': {
                    'id': boat.id,
                    'name': boat.name,
                    'model': boat.model,
                    'location': boat.location
                },
                'booking_type': booking.booking_type,
                'status': booking.status,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'guest_count': booking.guest_count,
                'total_amount': str(booking.total_amount) if booking.total_amount else None,
                'duration_days': booking.duration_days,
                'notes': booking.notes,
                'created_at': booking.created_at.isoformat()
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating booking: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to create booking'
        }, status=500)