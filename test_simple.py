#!/usr/bin/env python3
"""
Simple Payment System Test - No external dependencies
Tests Tasks 5-10 using Django's test client
"""
import os
import sys
import django

# Add current directory to Python path
sys.path.append('.')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.test import Client
import json

# Create test client
client = Client()

def test_rental_quote():
    """Test rental quote calculation"""
    print("🧪 Testing rental quote API...")
    response = client.get('/boats/1/rental-quote/?start_date=2025-09-20&end_date=2025-09-21&guest_count=8')
    
    if response.status_code == 200:
        data = response.json()
        if data.get('available'):
            quote = data['quote']
            boat = data['boat']
            print(f"✅ Quote: {boat['model']} {boat['name']} - ${quote['total_amount']} ({quote['duration_days']} days)")
            return True
        else:
            print(f"❌ Boat not available: {data.get('message')}")
    else:
        print(f"❌ Quote failed: HTTP {response.status_code}")
    return False

def test_rental_booking():
    """Test visitor rental booking"""
    print("🧪 Testing rental booking creation...")
    data = {
        'boat_id': 1,
        'contact_phone': '+15551234567',
        'start_date': '2025-09-20',
        'end_date': '2025-09-21',
        'guest_count': 8,
        'notes': 'Test booking'
    }
    
    response = client.post('/bookings/rental/', 
                          json.dumps(data), 
                          content_type='application/json')
    
    if response.status_code in [200, 201]:
        result = response.json()
        if result.get('success'):
            booking = result['booking']
            print(f"✅ Booking created: ID {booking['id']}, Total: ${booking['total_amount']}")
            return booking['id']
        else:
            print(f"❌ Booking failed: {result.get('message')}")
    else:
        print(f"❌ Booking failed: HTTP {response.status_code}")
    return None

def test_payment_intent(booking_id):
    """Test payment intent creation"""
    print("🧪 Testing payment intent creation...")
    data = {'booking_id': booking_id}
    
    response = client.post('/payments/rental/create-intent/',
                          json.dumps(data),
                          content_type='application/json')
    
    if response.status_code in [200, 201]:
        result = response.json()
        if result.get('success'):
            print(f"✅ Payment intent: {result['payment_intent_id']}, Amount: ${result['amount']}")
            return result['payment_intent_id']
        else:
            print(f"❌ Payment intent failed: {result.get('error')}")
    else:
        print(f"❌ Payment intent failed: HTTP {response.status_code}")
    return None

def test_fuel_wallet():
    """Test fuel wallet status"""
    print("🧪 Testing fuel wallet...")
    response = client.get('/fuel-wallet/?user_phone=%2B201234567890')
    
    if response.status_code == 200:
        result = response.json()
        if result.get('success'):
            wallet = result['fuel_wallet']
            print(f"✅ Fuel wallet: Balance ${wallet['current_balance']}, Transactions: {result['transaction_summary']['total_transactions']}")
            return True
        else:
            print(f"❌ Fuel wallet failed: {result.get('error')}")
    else:
        print(f"❌ Fuel wallet failed: HTTP {response.status_code}")
    return False

def test_fuel_payment():
    """Test fuel top-up payment"""
    print("🧪 Testing fuel top-up payment...")
    data = {'user_phone': '+201234567890', 'amount': 500}
    
    response = client.post('/payments/fuel/create-intent/',
                          json.dumps(data),
                          content_type='application/json')
    
    if response.status_code in [200, 201]:
        result = response.json()
        if result.get('success'):
            print(f"✅ Fuel payment: {result['payment_intent_id']}, Amount: ${result['amount']}")
            return True
        else:
            print(f"❌ Fuel payment failed: {result.get('error')}")
    else:
        print(f"❌ Fuel payment failed: HTTP {response.status_code}")
    return False

def test_fuel_consumption():
    """Test fuel consumption"""
    print("🧪 Testing fuel consumption...")
    data = {
        'user_phone': '+201234567890',
        'amount': 75,
        'engine_hours': 4.5,
        'booking_id': 1
    }
    
    response = client.post('/fuel-wallet/consume/',
                          json.dumps(data),
                          content_type='application/json')
    
    if response.status_code in [200, 201]:
        result = response.json()
        if result.get('success'):
            transaction = result['transaction']
            wallet = result['fuel_wallet']
            print(f"✅ Fuel consumed: ${transaction['amount']} for {transaction['engine_hours']} hours, Balance: ${wallet['current_balance']}")
            return True
        else:
            print(f"❌ Fuel consumption failed: {result.get('error')}")
    else:
        print(f"❌ Fuel consumption failed: HTTP {response.status_code}")
    return False

def main():
    """Run payment system tests"""
    print("🚀 Payment System Integration Test")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: Rental Quote
    total_tests += 1
    if test_rental_quote():
        tests_passed += 1
    
    # Test 2: Rental Booking
    total_tests += 1
    booking_id = test_rental_booking()
    if booking_id:
        tests_passed += 1
        
        # Test 3: Payment Intent (depends on booking)
        total_tests += 1
        if test_payment_intent(booking_id):
            tests_passed += 1
    
    # Test 4: Fuel Wallet
    total_tests += 1
    if test_fuel_wallet():
        tests_passed += 1
    
    # Test 5: Fuel Payment
    total_tests += 1
    if test_fuel_payment():
        tests_passed += 1
    
    # Test 6: Fuel Consumption
    total_tests += 1
    if test_fuel_consumption():
        tests_passed += 1
    
    # Results
    print("\n📊 Test Results")
    print("=" * 50)
    print(f"Passed: {tests_passed}/{total_tests} ({tests_passed/total_tests*100:.1f}%)")
    
    if tests_passed == total_tests:
        print("🎉 All payment system tests PASSED!")
        print("Tasks 5-10 payment integration is fully operational!")
        return True
    else:
        print("⚠️ Some tests failed. Check the errors above.")
        return False

if __name__ == "__main__":
    main()