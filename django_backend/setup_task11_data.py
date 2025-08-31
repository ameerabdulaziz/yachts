#!/usr/bin/env python3
"""
Setup Task 11 test data - Ensure ownership exists for testing
"""
import os
import sys
import django

sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.contrib.auth import get_user_model
from boats.models import Boat
from ownership.models import FractionalOwnership, FuelWallet
from decimal import Decimal

User = get_user_model()

def setup_task11_test_data():
    """Setup test data for Task 11 fuel threshold enforcement"""
    print("Setting up Task 11 test data...")
    
    # Get test user
    user, created = User.objects.get_or_create(
        phone='+201234567890',
        defaults={'is_phone_verified': True}
    )
    print(f"User: {user.phone} {'(created)' if created else '(exists)'}")
    
    # Get first active boat
    boat = Boat.objects.filter(is_active=True).first()
    if not boat:
        print("❌ No active boats found")
        return False
    
    print(f"Boat: {boat.model} {boat.name}")
    
    # Create fractional ownership if it doesn't exist
    ownership, created = FractionalOwnership.objects.get_or_create(
        boat=boat,
        owner=user,
        defaults={
            'share_percentage': '1/4',  # Use correct field name
            'is_active': True,
            'purchase_date': '2024-01-15',
            'purchase_price': Decimal('125000.00'),
            'annual_day_limit': 48,  # 1/4 share gets 48 days/year
        }
    )
    print(f"Ownership: {ownership.share_percentage} share {'(created)' if created else '(exists)'}")
    
    # Setup fuel wallet
    fuel_wallet, created = FuelWallet.objects.get_or_create(
        owner=user,
        defaults={
            'current_balance': Decimal('1000.00'),
            'total_purchased': Decimal('2000.00'),
            'total_consumed': Decimal('1000.00'),
            'low_balance_threshold': Decimal('200.00'),
            'auto_topup_enabled': False,
            'auto_topup_amount': Decimal('500.00'),
        }
    )
    print(f"Fuel wallet: ${fuel_wallet.current_balance} {'(created)' if created else '(exists)'}")
    
    print("✅ Task 11 test data setup complete")
    return True

if __name__ == "__main__":
    setup_task11_test_data()