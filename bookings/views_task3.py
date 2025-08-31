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

@require_http_methods(["GET"])
def user_bookings(request):
    """
    Get bookings for authenticated user (demo mode)
    GET /bookings/
    Query params: status, boat_id (optional)
    """
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