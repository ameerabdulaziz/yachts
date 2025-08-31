#!/usr/bin/env python3
"""
Payment System Integration Test Suite
Tests Tasks 5-10: Complete payment processing workflow
"""
import requests
import json
import time
from colorama import Fore, Style, init

# Initialize colorama for colored output
init(autoreset=True)

# Base URL for Django server
BASE_URL = "http://localhost:8000"

def print_test(test_name):
    print(f"\n{Fore.CYAN}🧪 {test_name}{Style.RESET_ALL}")
    print("-" * 50)

def print_success(message):
    print(f"{Fore.GREEN}✅ {message}{Style.RESET_ALL}")

def print_error(message):
    print(f"{Fore.RED}❌ {message}{Style.RESET_ALL}")

def print_info(message):
    print(f"{Fore.YELLOW}ℹ️  {message}{Style.RESET_ALL}")

def make_request(method, endpoint, data=None, params=None):
    """Make HTTP request and handle errors"""
    try:
        url = f"{BASE_URL}{endpoint}"
        
        if method.upper() == 'GET':
            response = requests.get(url, params=params)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        if response.status_code == 200 or response.status_code == 201:
            return True, response.json()
        else:
            return False, {"error": f"HTTP {response.status_code}: {response.text}"}
            
    except requests.exceptions.ConnectionError:
        return False, {"error": "Connection refused - Django server not running"}
    except Exception as e:
        return False, {"error": str(e)}

def test_rental_quote():
    """Test Task 5: Rental quote calculation"""
    print_test("Task 5 - Rental Quote API")
    
    success, data = make_request('GET', '/boats/1/rental-quote/', params={
        'start_date': '2025-09-20',
        'end_date': '2025-09-21', 
        'guest_count': '8'
    })
    
    if success:
        if data.get('available'):
            boat = data['boat']
            quote = data['quote']
            print_success(f"Quote for {boat['model']} {boat['name']}")
            print_info(f"Total: ${quote['total_amount']} ({quote['duration_days']} days)")
            print_info(f"Daily rate: ${quote['daily_rate']}")
            if quote.get('applied_multipliers'):
                for mult in quote['applied_multipliers']:
                    print_info(f"Multiplier: {mult['rule_name']} - {mult['multiplier']}x")
            return True
        else:
            print_error(f"Boat not available: {data.get('message')}")
            return False
    else:
        print_error(f"Quote request failed: {data['error']}")
        return False

def test_rental_booking():
    """Test Task 5: Visitor rental booking creation"""
    print_test("Task 5 - Visitor Rental Booking")
    
    success, data = make_request('POST', '/bookings/rental/', {
        'boat_id': 1,
        'contact_phone': '+15551234567',
        'start_date': '2025-09-20',
        'end_date': '2025-09-21',
        'guest_count': 8,
        'notes': 'Integration test booking'
    })
    
    if success:
        booking = data['booking']
        print_success(f"Rental booking created: ID {booking['id']}")
        print_info(f"Boat: {booking['boat']['model']} {booking['boat']['name']}")
        print_info(f"Status: {booking['status']}")
        print_info(f"Total: ${booking['total_amount']}")
        print_info(f"Next step: {data['next_step']}")
        return booking['id']
    else:
        print_error(f"Booking creation failed: {data.get('message') or data.get('error')}")
        return None

def test_payment_intent_rental(booking_id):
    """Test Task 6: Stripe PaymentIntent for rental"""
    print_test("Task 6 - Rental Payment Intent")
    
    success, data = make_request('POST', '/payments/rental/create-intent/', {
        'booking_id': booking_id
    })
    
    if success:
        print_success(f"Payment intent created: {data['payment_intent_id']}")
        print_info(f"Amount: ${data['amount']}")
        print_info(f"Status: {data['status']}")
        print_info(f"Client secret: {data['client_secret'][:20]}...")
        return data['payment_intent_id']
    else:
        print_error(f"Payment intent failed: {data.get('error')}")
        return None

def test_fuel_wallet():
    """Test Task 8: Fuel wallet status"""
    print_test("Task 8 - Fuel Wallet Status")
    
    success, data = make_request('GET', '/fuel-wallet/', params={
        'user_phone': '+201234567890'
    })
    
    if success:
        wallet = data['fuel_wallet']
        summary = data['transaction_summary']
        print_success("Fuel wallet retrieved")
        print_info(f"Balance: ${wallet['current_balance']}")
        print_info(f"Total purchased: ${wallet['total_purchased']}")
        print_info(f"Total consumed: ${wallet['total_consumed']}")
        print_info(f"Low balance: {wallet['is_low_balance']}")
        print_info(f"Total transactions: {summary['total_transactions']}")
        return True
    else:
        print_error(f"Fuel wallet failed: {data['error']}")
        return False

def test_fuel_payment_intent():
    """Test Task 9: Fuel top-up payment intent"""
    print_test("Task 9 - Fuel Top-up Payment Intent")
    
    success, data = make_request('POST', '/payments/fuel/create-intent/', {
        'user_phone': '+201234567890',
        'amount': 500
    })
    
    if success:
        wallet = data['fuel_wallet']
        print_success(f"Fuel payment intent created: {data['payment_intent_id']}")
        print_info(f"Amount: ${data['amount']}")
        print_info(f"Current balance: ${wallet['current_balance']}")
        print_info(f"Balance after top-up: ${wallet['balance_after_topup']}")
        return data['payment_intent_id']
    else:
        print_error(f"Fuel payment intent failed: {data.get('error')}")
        return None

def test_fuel_consumption():
    """Test Task 8: Fuel consumption simulation"""
    print_test("Task 8 - Fuel Consumption Simulation")
    
    success, data = make_request('POST', '/fuel-wallet/consume/', {
        'user_phone': '+201234567890',
        'amount': 75,
        'engine_hours': 4.5,
        'booking_id': 1
    })
    
    if success:
        transaction = data['transaction']
        wallet = data['fuel_wallet']
        print_success("Fuel consumption recorded")
        print_info(f"Consumed: ${transaction['amount']} for {transaction['engine_hours']} hours")
        print_info(f"New balance: ${wallet['current_balance']}")
        print_info(f"Low balance warning: {wallet['is_low_balance']}")
        return True
    else:
        print_error(f"Fuel consumption failed: {data.get('error')}")
        return False

def test_webhook_simulation():
    """Test Task 7: Stripe webhook processing"""
    print_test("Task 7 - Webhook Simulation")
    
    success, data = make_request('POST', '/webhooks/stripe/', {
        'type': 'payment_intent.succeeded',
        'data': {
            'object': {
                'id': 'pi_mock_50000_usd'
            }
        }
    })
    
    # Webhooks typically return 200 with no content
    if success or not data.get('error'):
        print_success("Webhook processed successfully")
        return True
    else:
        print_error(f"Webhook processing failed: {data.get('error')}")
        return False

def test_payment_status(booking_id):
    """Test payment status endpoint"""
    print_test("Payment Status Check")
    
    success, data = make_request('GET', f'/bookings/{booking_id}/payment-status/')
    
    if success:
        print_success("Payment status retrieved")
        print_info(f"Booking ID: {data['booking_id']}")
        print_info(f"Booking status: {data['booking_status']}")
        print_info(f"Payment status: {data['payment_status']}")
        if 'amount' in data:
            print_info(f"Amount: ${data['amount']}")
        return True
    else:
        print_error(f"Payment status failed: {data.get('error')}")
        return False

def test_fuel_transaction_history():
    """Test fuel transaction history"""
    print_test("Fuel Transaction History")
    
    success, data = make_request('GET', '/fuel-wallet/transactions/', params={
        'user_phone': '+201234567890',
        'limit': '5'
    })
    
    if success:
        transactions = data['transactions']
        summary = data['summary']
        print_success(f"Transaction history retrieved: {len(transactions)} transactions")
        print_info(f"Total transactions: {summary['total_transactions']}")
        print_info(f"Total amount: ${summary['total_amount']}")
        
        for tx in transactions[:3]:  # Show first 3
            print_info(f"  {tx['transaction_type']}: ${tx['amount']} (Balance: ${tx['balance_after']})")
        return True
    else:
        print_error(f"Transaction history failed: {data.get('error')}")
        return False

def main():
    """Run complete payment system test suite"""
    print(f"{Fore.MAGENTA}🚀 Payment System Integration Test Suite")
    print(f"Testing Tasks 5-10: Complete Payment Processing{Style.RESET_ALL}")
    print("=" * 60)
    
    results = []
    booking_id = None
    
    # Task 5 Tests
    results.append(("Rental Quote", test_rental_quote()))
    booking_id = test_rental_booking()
    results.append(("Rental Booking", booking_id is not None))
    
    # Task 6 & 7 Tests
    if booking_id:
        payment_intent_id = test_payment_intent_rental(booking_id)
        results.append(("Payment Intent (Rental)", payment_intent_id is not None))
        results.append(("Payment Status", test_payment_status(booking_id)))
    
    # Task 7 Test
    results.append(("Webhook Processing", test_webhook_simulation()))
    
    # Task 8 & 9 Tests
    results.append(("Fuel Wallet Status", test_fuel_wallet()))
    results.append(("Fuel Payment Intent", test_fuel_payment_intent() is not None))
    results.append(("Fuel Consumption", test_fuel_consumption()))
    results.append(("Fuel Transaction History", test_fuel_transaction_history()))
    
    # Summary
    print(f"\n{Fore.MAGENTA}📊 Test Results Summary{Style.RESET_ALL}")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, passed_test in results:
        status = f"{Fore.GREEN}PASS" if passed_test else f"{Fore.RED}FAIL"
        print(f"{status}{Style.RESET_ALL} - {test_name}")
        if passed_test:
            passed += 1
    
    print(f"\n{Fore.CYAN}Final Score: {passed}/{total} tests passed ({passed/total*100:.1f}%){Style.RESET_ALL}")
    
    if passed == total:
        print(f"\n{Fore.GREEN}🎉 All payment system tests PASSED!")
        print(f"Tasks 5-10 payment integration is fully operational!{Style.RESET_ALL}")
    else:
        print(f"\n{Fore.YELLOW}⚠️  Some tests failed. Payment system needs attention.{Style.RESET_ALL}")

if __name__ == "__main__":
    main()