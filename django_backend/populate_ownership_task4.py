#!/usr/bin/env python
"""
Task 4 - Populate Ownership and Rules Data
Creates fractional ownership records and booking rules for testing
"""
import os
import django
from datetime import date, timedelta
from decimal import Decimal

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.contrib.auth import get_user_model
from boats.models import Boat
from ownership.models import FractionalOwnership, BookingRule, FuelWallet

User = get_user_model()

def populate_ownership():
    """Populate ownership data for Task 4 testing"""
    
    # Clear existing ownership data
    FractionalOwnership.objects.all().delete()
    BookingRule.objects.all().delete()
    FuelWallet.objects.all().delete()
    
    # Get test user
    user, created = User.objects.get_or_create(
        phone='+201234567890',
        defaults={
            'is_phone_verified': True,
            'email': 'demo@nauttec.com'
        }
    )
    
    # Get boats
    boats = list(Boat.objects.all()[:3])
    
    if not boats:
        print("❌ No boats found. Please run populate_boats_task2.py first")
        return
    
    # Create fractional ownership records
    ownership_data = [
        {
            'boat': boats[0],  # D60 Serenity
            'owner': user,
            'share_percentage': '1/4',
            'purchase_date': date(2024, 6, 15),
            'purchase_price': Decimal('750000.00'),
            'annual_day_limit': 48,
            'current_year_days_used': 12,  # Has used some days
        },
        {
            'boat': boats[1],  # D50 Azure Dream  
            'owner': user,
            'share_percentage': '1/8',
            'purchase_date': date(2024, 8, 20),
            'purchase_price': Decimal('400000.00'),
            'annual_day_limit': 48,
            'current_year_days_used': 5,
        }
    ]
    
    # Create booking rules
    today = date.today()
    booking_rules_data = [
        {
            'boat': boats[0],
            'rule_type': 'seasonal_multiplier',
            'rule_name': 'Summer Peak Season',
            'rule_description': 'Higher rates during summer months',
            'start_date': date(2025, 6, 1),
            'end_date': date(2025, 8, 31),
            'multiplier_value': Decimal('1.5'),
        },
        {
            'boat': boats[0],
            'rule_type': 'advance_booking',
            'rule_name': 'Peak Season Advance Booking',
            'rule_description': 'Require 30 days advance booking during peak season',
            'start_date': date(2025, 6, 1),
            'end_date': date(2025, 8, 31),
            'days_requirement': 30,
        },
        {
            'boat': boats[1],
            'rule_type': 'minimum_stay',
            'rule_name': 'Weekend Minimum Stay',
            'rule_description': 'Minimum 2-day stay on weekends',
            'start_date': today,
            'end_date': today + timedelta(days=365),
            'days_requirement': 2,
        },
        {
            'boat': boats[1],
            'rule_type': 'seasonal_multiplier',
            'rule_name': 'Holiday Premium',
            'rule_description': 'Premium rates during holidays',
            'start_date': date(2025, 12, 20),
            'end_date': date(2026, 1, 5),
            'multiplier_value': Decimal('2.0'),
        }
    ]
    
    # Create ownership records
    ownerships_created = 0
    for ownership_data_item in ownership_data:
        ownership = FractionalOwnership.objects.create(**ownership_data_item)
        ownerships_created += 1
        print(f"✅ Created ownership: {ownership.owner.phone} - {ownership.boat.model} ({ownership.share_percentage})")
    
    # Create booking rules
    rules_created = 0
    for rule_data in booking_rules_data:
        rule = BookingRule.objects.create(**rule_data)
        rules_created += 1
        print(f"✅ Created rule: {rule.boat.model} - {rule.rule_name}")
    
    # Create fuel wallet
    fuel_wallet = FuelWallet.objects.create(
        owner=user,
        current_balance=Decimal('1500.00'),
        total_purchased=Decimal('2000.00'),
        total_consumed=Decimal('500.00'),
        low_balance_threshold=Decimal('200.00')
    )
    print(f"✅ Created fuel wallet: {user.phone} (${fuel_wallet.current_balance})")
    
    print(f"\n🎉 Task 4 - Ownership Population Complete!")
    print(f"🏠 Created {ownerships_created} ownership records")
    print(f"📋 Created {rules_created} booking rules")
    print(f"⛽ Created fuel wallet with ${fuel_wallet.current_balance}")
    print(f"👤 Owner: {user.phone}")
    print(f"🚢 Owns shares in: {', '.join([o.boat.model for o in FractionalOwnership.objects.filter(owner=user)])}")

if __name__ == '__main__':
    populate_ownership()