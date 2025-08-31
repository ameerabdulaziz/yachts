"""
Task 6 - Stripe PaymentIntent (Rental) Views
Create payment intents for rental bookings
"""
import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from decimal import Decimal
from bookings.models import Booking
from .models import PaymentIntent
from .stripe_service import stripe_service
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def create_payment_intent_rental(request):
    """
    Task 6 - Create Stripe PaymentIntent for rental booking
    POST /payments/rental/create-intent/
    Body: {"booking_id": 123}
    Returns: {"client_secret": "pi_...", "payment_intent_id": "pi_..."}
    """
    try:
        data = json.loads(request.body)
        booking_id = data.get('booking_id')
        
        if not booking_id:
            return JsonResponse({
                'success': False,
                'error': 'booking_id is required'
            }, status=400)
        
        # Get the booking
        try:
            booking = Booking.objects.get(
                id=booking_id,
                booking_type='rental',
                status='pending'
            )
        except Booking.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Booking not found or not eligible for payment'
            }, status=404)
        
        # Check if payment intent already exists
        existing_payment = PaymentIntent.objects.filter(
            booking=booking,
            payment_type='rental_booking',
            status__in=['requires_payment_method', 'requires_confirmation', 'requires_action']
        ).first()
        
        if existing_payment:
            return JsonResponse({
                'success': True,
                'payment_intent_id': existing_payment.stripe_payment_intent_id,
                'client_secret': existing_payment.stripe_client_secret,
                'amount': float(existing_payment.amount),
                'status': existing_payment.status,
                'message': 'Using existing payment intent'
            })
        
        # Create Stripe PaymentIntent
        amount = booking.total_amount
        description = f"Yacht rental: {booking.boat.model} {booking.boat.name} ({booking.start_date} to {booking.end_date})"
        
        metadata = {
            'booking_id': str(booking.id),
            'boat_id': str(booking.boat.id),
            'boat_model': booking.boat.model,
            'start_date': booking.start_date.isoformat(),
            'end_date': booking.end_date.isoformat(),
            'guest_count': str(booking.guest_count),
            'user_phone': booking.user.phone,
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
            user=booking.user,
            payment_type='rental_booking',
            amount=amount,
            currency='USD',
            status=payment_intent_data['status'],
            booking=booking,
            description=description,
            metadata=metadata
        )
        
        logger.info(f"PaymentIntent created for rental booking {booking.id}: {payment_record.stripe_payment_intent_id}")
        
        return JsonResponse({
            'success': True,
            'payment_intent_id': payment_intent_data['id'],
            'client_secret': payment_intent_data['client_secret'],
            'amount': float(amount),
            'currency': 'USD',
            'status': payment_intent_data['status'],
            'booking': {
                'id': booking.id,
                'boat_name': f"{booking.boat.model} {booking.boat.name}",
                'dates': f"{booking.start_date} to {booking.end_date}",
                'guest_count': booking.guest_count,
                'duration_days': booking.duration_days,
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating rental payment intent: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Failed to create payment intent'
        }, status=500)

@require_http_methods(["GET"])
def get_payment_intent_status(request, payment_intent_id):
    """
    Get payment intent status
    GET /payments/intent/{payment_intent_id}/status/
    """
    try:
        # Get from database first
        try:
            payment_record = PaymentIntent.objects.get(
                stripe_payment_intent_id=payment_intent_id
            )
        except PaymentIntent.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Payment intent not found'
            }, status=404)
        
        # Retrieve latest status from Stripe
        success, payment_intent_data, error = stripe_service.retrieve_payment_intent(payment_intent_id)
        
        if success:
            # Update local record with latest status
            payment_record.status = payment_intent_data['status']
            payment_record.save()
        
        return JsonResponse({
            'success': True,
            'payment_intent_id': payment_intent_id,
            'status': payment_record.status,
            'amount': float(payment_record.amount),
            'currency': payment_record.currency,
            'payment_type': payment_record.payment_type,
            'booking_id': payment_record.booking.id if payment_record.booking else None,
            'created_at': payment_record.created_at.isoformat(),
        })
        
    except Exception as e:
        logger.error(f"Error getting payment intent status: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Failed to get payment status'
        }, status=500)