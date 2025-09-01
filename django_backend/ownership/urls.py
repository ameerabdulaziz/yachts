"""
URL configuration for ownership app
Fractional ownership and fuel wallet endpoints
"""
from django.urls import path
from . import views

app_name = 'ownership'

urlpatterns = [
    # Fractional ownership endpoints
    path('ownership/', views.list_ownerships, name='list-ownerships'),
    path('ownership/user/<str:user_phone>/', views.user_ownership, name='user-ownership'),
    path('ownership/<int:ownership_id>/', views.ownership_detail, name='ownership-detail'),
    
    # Fuel wallet endpoints
    path('fuel-wallet/', views.list_fuel_wallets, name='list-fuel-wallets'),
    path('fuel-wallet/user/<str:user_phone>/', views.user_fuel_wallet, name='user-fuel-wallet'),
    path('fuel-wallet/<int:wallet_id>/', views.fuel_wallet_detail, name='fuel-wallet-detail'),
    path('fuel-wallet/<int:wallet_id>/transactions/', views.fuel_transactions, name='fuel-transactions'),
    path('fuel-wallet/<int:wallet_id>/add-funds/', views.add_fuel_funds, name='add-fuel-funds'),
    path('fuel-wallet/<int:wallet_id>/deduct/', views.deduct_fuel, name='deduct-fuel'),
]