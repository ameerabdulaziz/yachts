"""
Task 7 - Stripe Webhook (Confirm Rental) Views
Handle Stripe webhook events for payment confirmations
"""
import json
from datetime import datetime
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.contrib.auth import get_user_model
from bookings.models import Booking
from .models import PaymentIntent, FuelTransaction
from .stripe_service import stripe_service
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def stripe_webhook(request):
    """
    Task 7 - Handle Stripe webhook events
    POST /webhooks/stripe/
    Processes payment_intent.succeeded events to confirm rental bookings
    """
    try:
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
        
        # Verify webhook signature and construct event
        success, event_data, error = stripe_service.construct_webhook_event(payload, sig_header)
        
        if not success:
            logger.error(f"Webhook signature verification failed: {error}")
            return HttpResponse(status=400)
        
        event_type = event_data.get('type')
        logger.info(f"Received webhook event: {event_type}")
        
        # Handle payment_intent.succeeded events - Task 7
        if event_type == 'payment_intent.succeeded':
            payment_intent_data = event_data['data']['object']
            payment_intent_id = payment_intent_data['id']
            
            success = handle_payment_succeeded(payment_intent_id, payment_intent_data)
            
            if success:
                logger.info(f"Successfully processed payment_intent.succeeded for {payment_intent_id}")
                return HttpResponse(status=200)
            else:
                logger.error(f"Failed to process payment_intent.succeeded for {payment_intent_id}")
                return HttpResponse(status=500)
        
        # Handle payment_intent.payment_failed events
        elif event_type == 'payment_intent.payment_failed':
            payment_intent_data = event_data['data']['object']
            payment_intent_id = payment_intent_data['id']
            
            success = handle_payment_failed(payment_intent_id, payment_intent_data)
            
            if success:
                logger.info(f"Successfully processed payment_intent.payment_failed for {payment_intent_id}")
                return HttpResponse(status=200)
            else:
                logger.error(f"Failed to process payment_intent.payment_failed for {payment_intent_id}")
                return HttpResponse(status=500)
        
        else:
            # Unhandled event type
            logger.info(f"Unhandled webhook event type: {event_type}")
            return HttpResponse(status=200)
        
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        return HttpResponse(status=500)

def handle_payment_succeeded(payment_intent_id, payment_intent_data):
    """
    Handle successful payment - Task 7
    Confirms rental booking and updates status
    """
    try:
        # Find the payment intent record
        try:
            payment_record = PaymentIntent.objects.get(
                stripe_payment_intent_id=payment_intent_id
            )
        except PaymentIntent.DoesNotExist:
            logger.error(f"PaymentIntent not found in database: {payment_intent_id}")
            return False
        
        # Update payment status
        payment_record.status = 'succeeded'
        payment_record.save()
        
        # If this is a rental booking payment, confirm the booking
        if payment_record.payment_type == 'rental_booking' and payment_record.booking:
            booking = payment_record.booking
            
            # Confirm the rental booking - Task 7 core requirement
            booking.status = 'confirmed'
            booking.save()
            
            logger.info(f"Rental booking {booking.id} confirmed via payment {payment_intent_id}")
            
            # Optional: Send confirmation email/SMS (would be implemented in notifications)
            # Optional: Create calendar event
            
        # If this is a fuel wallet top-up, add credits
        elif payment_record.payment_type == 'fuel_topup' and payment_record.fuel_wallet:
            fuel_wallet = payment_record.fuel_wallet
            
            # Add fuel credits
            balance_before = fuel_wallet.current_balance
            fuel_wallet.current_balance += payment_record.amount
            fuel_wallet.total_purchased += payment_record.amount
            fuel_wallet.save()
            
            # Create transaction record
            FuelTransaction.objects.create(
                fuel_wallet=fuel_wallet,
                payment_intent=payment_record,
                transaction_type='purchase',
                amount=payment_record.amount,
                balance_before=balance_before,
                balance_after=fuel_wallet.current_balance,
                description=f"Fuel top-up via payment {payment_intent_id}"
            )
            
            logger.info(f"Fuel wallet {fuel_wallet.id} topped up with ${payment_record.amount}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error handling payment success: {e}")
        return False

def handle_payment_failed(payment_intent_id, payment_intent_data):
    """
    Handle failed payment
    Updates payment status and optionally cancels booking
    """
    try:
        # Find the payment intent record
        try:
            payment_record = PaymentIntent.objects.get(
                stripe_payment_intent_id=payment_intent_id
            )
        except PaymentIntent.DoesNotExist:
            logger.error(f"PaymentIntent not found in database: {payment_intent_id}")
            return False
        
        # Update payment status
        payment_record.status = 'payment_failed'
        payment_record.save()
        
        # If rental booking, optionally cancel after grace period
        if payment_record.payment_type == 'rental_booking' and payment_record.booking:
            booking = payment_record.booking
            
            # Mark booking as payment failed (could implement auto-cancel logic)
            logger.warning(f"Payment failed for rental booking {booking.id}")
            
            # Optional: Implement grace period or automatic cancellation
            # booking.status = 'cancelled'
            # booking.save()
        
        return True
        
    except Exception as e:
        logger.error(f"Error handling payment failure: {e}")
        return False

@require_http_methods(["GET"])
def payment_status(request, booking_id):
    """
    Get payment status for a booking
    GET /bookings/{booking_id}/payment-status/
    """
    try:
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Booking not found'
            }, status=404)
        
        # Get payment intents for this booking
        payment_intents = PaymentIntent.objects.filter(booking=booking).order_by('-created_at')
        
        if not payment_intents.exists():
            return JsonResponse({
                'booking_id': booking_id,
                'booking_status': booking.status,
                'payment_status': 'no_payment_required' if booking.booking_type == 'owner' else 'payment_not_started',
                'amount_due': str(booking.total_amount) if booking.booking_type == 'rental' else '0.00',
            })
        
        latest_payment = payment_intents.first()
        
        return JsonResponse({
            'booking_id': booking_id,
            'booking_status': booking.status,
            'payment_status': latest_payment.status,
            'payment_intent_id': latest_payment.stripe_payment_intent_id,
            'amount': str(latest_payment.amount),
            'currency': latest_payment.currency,
            'created_at': latest_payment.created_at.isoformat(),
        })
        
    except Exception as e:
        logger.error(f"Error getting payment status: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Failed to get payment status'
        }, status=500)