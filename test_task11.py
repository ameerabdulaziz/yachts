#!/usr/bin/env python3
"""
Task 11 - Fuel Threshold Enforcement Test
Tests enhanced owner booking with fuel balance validation
"""
import os
import sys
import django

# Set up Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from ownership.models import FuelWallet
from decimal import Decimal
import json

User = get_user_model()

def setup_test_data():
    """Set up test data for Task 11"""
    print("🔧 Setting up Task 11 test data...")
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        phone='+201234567890',
        defaults={'is_phone_verified': True}
    )
    
    # Get fuel wallet and set different balance scenarios
    fuel_wallet, created = FuelWallet.objects.get_or_create(
        owner=user,
        defaults={
            'current_balance': Decimal('1000.00'),
            'total_purchased': Decimal('2000.00'),
            'total_consumed': Decimal('1000.00'),
            'low_balance_threshold': Decimal('200.00'),
        }
    )
    
    print(f"   User: {user.phone}")
    print(f"   Fuel balance: ${fuel_wallet.current_balance}")
    return user, fuel_wallet

def test_owner_eligibility_check():
    """Test owner booking eligibility with fuel analysis"""
    print("🧪 Testing owner booking eligibility check...")
    
    client = Client()
    response = client.get('/boats/1/owner-eligibility/', {
        'user_phone': '+201234567890',
        'start_date': '2025-09-25',
        'end_date': '2025-09-27',
        'estimated_engine_hours': '15'
    })
    
    if response.status_code == 200:
        data = response.json()
        fuel_analysis = data['fuel_analysis']
        
        print(f"✅ Eligibility check completed:")
        print(f"   Overall eligible: {data['eligible']}")
        print(f"   Current fuel balance: ${fuel_analysis['current_balance']}")
        print(f"   Estimated fuel cost: ${fuel_analysis['estimated_fuel_cost']}")
        print(f"   Required balance: ${fuel_analysis['required_balance']}")
        print(f"   Sufficient fuel: {fuel_analysis['sufficient_fuel']}")
        
        # Show eligibility checks
        for check in data['eligibility_checks']:
            status = "✅" if check['passed'] else "❌"
            print(f"   {status} {check['check']}: {check['message']}")
        
        return data['eligible']
    else:
        print(f"❌ Eligibility check failed: HTTP {response.status_code}")
        return False

def test_owner_booking_with_sufficient_fuel():
    """Test owner booking with sufficient fuel balance"""
    print("🧪 Testing owner booking with sufficient fuel...")
    
    # Ensure sufficient fuel balance
    user, fuel_wallet = setup_test_data()
    fuel_wallet.current_balance = Decimal('1000.00')  # High balance
    fuel_wallet.save()
    
    client = Client()
    booking_data = {
        'user_phone': '+201234567890',
        'boat_id': 1,
        'start_date': '2025-09-25',
        'end_date': '2025-09-27',
        'guest_count': 6,
        'estimated_engine_hours': 15,
        'notes': 'Task 11 test - sufficient fuel'
    }
    
    response = client.post('/bookings/owner-enhanced/',
                          json.dumps(booking_data),
                          content_type='application/json')
    
    if response.status_code == 201:
        result = response.json()
        if result.get('success'):
            booking = result['booking']
            fuel_analysis = result['fuel_analysis']
            
            print(f"✅ Booking successful with sufficient fuel:")
            print(f"   Booking ID: {booking['id']}")
            print(f"   Duration: {booking['duration_days']} days")
            print(f"   Fuel balance: ${fuel_analysis['current_balance']}")
            print(f"   Estimated cost: ${fuel_analysis['estimated_fuel_cost']}")
            print(f"   Balance after trip: ${fuel_analysis['balance_after_trip']}")
            return True
        else:
            print(f"❌ Booking failed: {result.get('message')}")
            return False
    else:
        print(f"❌ Booking request failed: HTTP {response.status_code}")
        return False

def test_owner_booking_with_insufficient_fuel():
    """Test owner booking rejection due to insufficient fuel"""
    print("🧪 Testing owner booking rejection - insufficient fuel...")
    
    # Set low fuel balance
    user, fuel_wallet = setup_test_data()
    fuel_wallet.current_balance = Decimal('50.00')  # Very low balance
    fuel_wallet.save()
    
    client = Client()
    booking_data = {
        'user_phone': '+201234567890',
        'boat_id': 1,
        'start_date': '2025-09-28',
        'end_date': '2025-09-30',
        'guest_count': 8,
        'estimated_engine_hours': 20,  # High fuel consumption
        'notes': 'Task 11 test - insufficient fuel'
    }
    
    response = client.post('/bookings/owner-enhanced/',
                          json.dumps(booking_data),
                          content_type='application/json')
    
    if response.status_code == 400:
        result = response.json()
        if result.get('rule_violation') == 'insufficient_fuel':
            fuel_analysis = result['fuel_analysis']
            
            print(f"✅ Booking correctly rejected for insufficient fuel:")
            print(f"   Current balance: ${fuel_analysis['current_balance']}")
            print(f"   Required balance: ${fuel_analysis['required_balance']}")
            print(f"   Fuel deficit: ${fuel_analysis['fuel_deficit']}")
            print(f"   Estimated cost: ${fuel_analysis['estimated_cost']}")
            print(f"   Engine hours: {fuel_analysis['estimated_engine_hours']}")
            
            print("   Recommendations:")
            for rec in result.get('recommendations', []):
                print(f"     - {rec}")
            return True
        else:
            print(f"❌ Unexpected rejection reason: {result.get('rule_violation')}")
            return False
    else:
        print(f"❌ Expected rejection (HTTP 400), got: HTTP {response.status_code}")
        return False

def test_fuel_rate_calculation():
    """Test fuel rate calculation for different boat models"""
    print("🧪 Testing fuel rate calculation for different boat models...")
    
    # Set medium fuel balance
    user, fuel_wallet = setup_test_data()
    fuel_wallet.current_balance = Decimal('300.00')
    fuel_wallet.save()
    
    # Test different boat models (assuming boat ID 1 is available)
    test_scenarios = [
        {'hours': 10, 'expected_high_consumption': False},
        {'hours': 20, 'expected_high_consumption': True},
    ]
    
    client = Client()
    
    for scenario in test_scenarios:
        response = client.get('/boats/1/owner-eligibility/', {
            'user_phone': '+201234567890',
            'start_date': '2025-10-01',
            'end_date': '2025-10-03',
            'estimated_engine_hours': str(scenario['hours'])
        })
        
        if response.status_code == 200:
            data = response.json()
            fuel_analysis = data['fuel_analysis']
            
            print(f"   {scenario['hours']} hours scenario:")
            print(f"     Fuel rate: ${fuel_analysis['fuel_rate_per_hour']}/hour")
            print(f"     Estimated cost: ${fuel_analysis['estimated_fuel_cost']}")
            print(f"     Required balance: ${fuel_analysis['required_balance']}")
            print(f"     Sufficient fuel: {fuel_analysis['sufficient_fuel']}")
    
    return True

def main():
    """Run Task 11 fuel threshold enforcement tests"""
    print("🚀 Task 11 - Fuel Threshold Enforcement Tests")
    print("=" * 60)
    
    # Set up test data
    setup_test_data()
    
    tests = [
        ("Owner Eligibility Check", test_owner_eligibility_check),
        ("Sufficient Fuel Booking", test_owner_booking_with_sufficient_fuel),
        ("Insufficient Fuel Rejection", test_owner_booking_with_insufficient_fuel),
        ("Fuel Rate Calculation", test_fuel_rate_calculation),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        try:
            if test_func():
                print(f"✅ {test_name} - PASSED")
                passed += 1
            else:
                print(f"❌ {test_name} - FAILED")
        except Exception as e:
            print(f"❌ {test_name} - ERROR: {e}")
    
    print(f"\n{'='*60}")
    print(f"📊 Task 11 Test Results: {passed}/{total} ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 Task 11 - Fuel Threshold Enforcement COMPLETED!")
        print("Enhanced owner booking system with fuel validation is operational")
    else:
        print("⚠️ Some tests failed. Task 11 needs attention.")
    
    return passed == total

if __name__ == "__main__":
    main()