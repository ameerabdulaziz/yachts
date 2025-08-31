"""
URL configuration for payment_system app
Tasks 6-10 - Payment processing endpoints
"""
from django.urls import path
from . import views_task6, views_task7, views_task8, views_task9

app_name = 'payment_system'

urlpatterns = [
    # Task 6 - Stripe PaymentIntent (Rental) endpoints
    path('payments/rental/create-intent/', views_task6.create_payment_intent_rental, name='create-payment-intent-rental'),
    path('payments/intent/<str:payment_intent_id>/status/', views_task6.get_payment_intent_status, name='get-payment-intent-status'),
    
    # Task 7 - Stripe Webhook (Confirm Rental) endpoints
    path('webhooks/stripe/', views_task7.stripe_webhook, name='stripe-webhook'),
    path('bookings/<int:booking_id>/payment-status/', views_task7.payment_status, name='payment-status'),
    
    # Task 8 - Fuel Wallet (View + History) endpoints
    path('fuel-wallet/', views_task8.get_fuel_wallet, name='get-fuel-wallet'),
    path('fuel-wallet/transactions/', views_task8.get_fuel_transaction_history, name='get-fuel-transaction-history'),
    path('fuel-wallet/consume/', views_task8.simulate_fuel_consumption, name='simulate-fuel-consumption'),
    
    # Task 9 - Stripe PaymentIntent (Fuel Top-Up) endpoints
    path('payments/fuel/create-intent/', views_task9.create_payment_intent_fuel, name='create-payment-intent-fuel'),
    path('fuel-wallet/auto-topup/', views_task9.auto_topup_fuel, name='auto-topup-fuel'),
]