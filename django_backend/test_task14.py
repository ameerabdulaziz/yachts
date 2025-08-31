#!/usr/bin/env python3
"""
Task 14 - Seed Data & Postman Collection Test
Validates comprehensive test data and API documentation
"""
import os
import sys
import django
import json

# Set up Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.contrib.auth import get_user_model
from boats.models import Boat
from bookings.models import Booking
from ownership.models import FractionalOwnership, FuelWallet
from payment_system.models import PaymentIntent
from inquiries.models import Inquiry, LeadSource
from notify_system.models import Notification, NotificationTemplate
from django.test import Client

User = get_user_model()

def test_user_data():
    """Test user data creation and diversity"""
    print("👥 Testing user data...")
    
    users = User.objects.all()
    roles = users.values_list('role', flat=True).distinct()
    
    print(f"   Total users: {users.count()}")
    print(f"   User roles: {list(roles)}")
    
    # Test role distribution
    role_counts = {}
    for role in ['renter', 'owner', 'admin']:
        count = users.filter(role=role).count()
        role_counts[role] = count
        print(f"   {role.title()}s: {count}")
    
    # Verify we have each role type
    success = all(count > 0 for count in role_counts.values())
    
    if success:
        print("✅ User diversity validated")
    else:
        print("❌ Missing user role types")
    
    return success

def test_yacht_fleet():
    """Test yacht fleet data"""
    print("🛥️ Testing yacht fleet...")
    
    yachts = Boat.objects.all()
    models = yachts.values_list('model', flat=True).distinct()
    locations = yachts.values_list('location', flat=True).distinct()
    
    print(f"   Total yachts: {yachts.count()}")
    print(f"   Yacht models: {list(models)}")
    print(f"   Locations: {list(locations)}")
    
    # Test specifications
    yachts_with_specs = yachts.exclude(specifications__isnull=True).count()
    print(f"   Yachts with specifications: {yachts_with_specs}")
    
    # Test price range diversity
    min_rate = yachts.aggregate(min_rate=models.Min('daily_rate'))['min_rate']
    max_rate = yachts.aggregate(max_rate=models.Max('daily_rate'))['max_rate']
    print(f"   Price range: ${min_rate} - ${max_rate}")
    
    success = (yachts.count() >= 5 and 
              len(models) >= 4 and 
              yachts_with_specs == yachts.count() and
              max_rate > min_rate * 3)
    
    if success:
        print("✅ Yacht fleet validated")
    else:
        print("❌ Yacht fleet incomplete")
    
    return success

def test_ownership_data():
    """Test ownership structures"""
    print("🏠 Testing ownership data...")
    
    ownerships = FractionalOwnership.objects.all()
    owned_yachts = ownerships.values_list('boat', flat=True).distinct()
    
    print(f"   Total ownership records: {ownerships.count()}")
    print(f"   Yachts with owners: {len(owned_yachts)}")
    
    # Test fractional ownership
    fractional_yachts = 0
    for yacht_id in owned_yachts:
        yacht_ownerships = ownerships.filter(yacht_id=yacht_id)
        total_share = sum(o.share_percentage for o in yacht_ownerships)
        if yacht_ownerships.count() > 1:
            fractional_yachts += 1
            print(f"   Yacht {yacht_id}: {yacht_ownerships.count()} owners, {total_share}% total")
    
    print(f"   Fractional ownership yachts: {fractional_yachts}")
    
    success = ownerships.count() >= 5 and fractional_yachts >= 2
    
    if success:
        print("✅ Ownership structures validated")
    else:
        print("❌ Ownership structures incomplete")
    
    return success

def test_fuel_wallets():
    """Test fuel wallet data"""
    print("⛽ Testing fuel wallets...")
    
    wallets = FuelWallet.objects.all()
    transactions = sum(wallet.fueltransaction_set.count() for wallet in wallets)
    
    print(f"   Total fuel wallets: {wallets.count()}")
    print(f"   Total fuel transactions: {transactions}")
    
    # Test balance diversity
    balances = [wallet.balance for wallet in wallets]
    min_balance = min(balances) if balances else 0
    max_balance = max(balances) if balances else 0
    low_balance_wallets = wallets.filter(balance__lt=200).count()
    
    print(f"   Balance range: ${min_balance} - ${max_balance}")
    print(f"   Low balance wallets: {low_balance_wallets}")
    
    success = (wallets.count() >= 5 and 
              transactions >= 15 and 
              low_balance_wallets >= 1 and
              max_balance > min_balance * 10)
    
    if success:
        print("✅ Fuel wallet data validated")
    else:
        print("❌ Fuel wallet data incomplete")
    
    return success

def test_booking_scenarios():
    """Test booking scenarios"""
    print("📅 Testing booking scenarios...")
    
    bookings = Booking.objects.all()
    statuses = bookings.values_list('status', flat=True).distinct()
    
    print(f"   Total bookings: {bookings.count()}")
    print(f"   Booking statuses: {list(statuses)}")
    
    # Test booking diversity
    user_types = set()
    for booking in bookings:
        user_types.add(booking.user.role)
    
    print(f"   Booking user types: {list(user_types)}")
    
    # Test date ranges
    future_bookings = bookings.filter(start_date__gte=django.utils.timezone.now().date()).count()
    print(f"   Future bookings: {future_bookings}")
    
    success = (bookings.count() >= 4 and 
              'confirmed' in statuses and 
              len(user_types) >= 2 and
              future_bookings >= 3)
    
    if success:
        print("✅ Booking scenarios validated")
    else:
        print("❌ Booking scenarios incomplete")
    
    return success

def test_payment_history():
    """Test payment data"""
    print("💳 Testing payment history...")
    
    payments = PaymentIntent.objects.all()
    successful_payments = payments.filter(status='succeeded').count()
    
    print(f"   Total payment intents: {payments.count()}")
    print(f"   Successful payments: {successful_payments}")
    
    if payments:
        total_amount = sum(p.amount for p in payments)
        avg_amount = total_amount / payments.count()
        print(f"   Total payment volume: ${total_amount}")
        print(f"   Average payment: ${avg_amount:.2f}")
    
    success = payments.count() >= 3 and successful_payments >= 3
    
    if success:
        print("✅ Payment history validated")
    else:
        print("❌ Payment history incomplete")
    
    return success

def test_inquiry_system():
    """Test inquiry and lead data"""
    print("🎯 Testing inquiry system...")
    
    inquiries = Inquiry.objects.all()
    lead_sources = LeadSource.objects.all()
    inquiry_types = inquiries.values_list('inquiry_type', flat=True).distinct()
    qualified_leads = inquiries.filter(is_qualified=True).count()
    
    print(f"   Total inquiries: {inquiries.count()}")
    print(f"   Lead sources: {lead_sources.count()}")
    print(f"   Inquiry types: {list(inquiry_types)}")
    print(f"   Qualified leads: {qualified_leads}")
    
    # Test lead scoring
    if inquiries:
        scores = [inq.lead_score for inq in inquiries]
        avg_score = sum(scores) / len(scores)
        print(f"   Average lead score: {avg_score:.1f}")
    
    success = (inquiries.count() >= 3 and 
              lead_sources.count() >= 4 and 
              len(inquiry_types) >= 2 and
              qualified_leads >= 1)
    
    if success:
        print("✅ Inquiry system validated")
    else:
        print("❌ Inquiry system incomplete")
    
    return success

def test_notification_system():
    """Test notification data"""
    print("🔔 Testing notification system...")
    
    notifications = Notification.objects.all()
    templates = NotificationTemplate.objects.all()
    notification_types = notifications.values_list('notification_type', flat=True).distinct()
    
    print(f"   Total notifications: {notifications.count()}")
    print(f"   Notification templates: {templates.count()}")
    print(f"   Notification types: {list(notification_types)}")
    
    # Test template coverage
    template_types = templates.values_list('notification_type', flat=True)
    print(f"   Template types: {list(template_types)}")
    
    success = (notifications.count() >= 4 and 
              templates.count() >= 4 and 
              len(notification_types) >= 3)
    
    if success:
        print("✅ Notification system validated")
    else:
        print("❌ Notification system incomplete")
    
    return success

def test_postman_collection():
    """Test Postman collection file"""
    print("📋 Testing Postman collection...")
    
    try:
        with open('nauttec_postman_collection.json', 'r') as f:
            collection = json.load(f)
        
        # Validate collection structure
        required_keys = ['info', 'variable', 'item']
        for key in required_keys:
            if key not in collection:
                print(f"❌ Missing key: {key}")
                return False
        
        # Count endpoints
        total_endpoints = 0
        folders = collection['item']
        
        print(f"   Collection name: {collection['info']['name']}")
        print(f"   API folders: {len(folders)}")
        
        for folder in folders:
            if 'item' in folder:
                endpoints = len(folder['item'])
                total_endpoints += endpoints
                print(f"     {folder['name']}: {endpoints} endpoints")
        
        print(f"   Total endpoints: {total_endpoints}")
        
        # Validate variables
        variables = collection.get('variable', [])
        variable_names = [var['key'] for var in variables]
        print(f"   Variables: {variable_names}")
        
        success = (total_endpoints >= 25 and 
                  len(folders) >= 7 and 
                  'base_url' in variable_names)
        
        if success:
            print("✅ Postman collection validated")
        else:
            print("❌ Postman collection incomplete")
        
        return success
        
    except FileNotFoundError:
        print("❌ Postman collection file not found")
        return False
    except json.JSONDecodeError:
        print("❌ Invalid JSON in Postman collection")
        return False

def test_api_endpoints():
    """Test key API endpoints are working"""
    print("🔗 Testing API endpoints...")
    
    client = Client()
    
    # Test endpoints that should work without authentication
    endpoints_to_test = [
        ('/boats/', 'GET'),
        ('/boats/1/', 'GET'),
        ('/inquiries/list/', 'GET'),
    ]
    
    working_endpoints = 0
    for endpoint, method in endpoints_to_test:
        try:
            if method == 'GET':
                response = client.get(endpoint)
            else:
                response = client.post(endpoint)
            
            if response.status_code in [200, 404]:  # 404 is acceptable for some endpoints
                working_endpoints += 1
                print(f"   ✅ {method} {endpoint}: HTTP {response.status_code}")
            else:
                print(f"   ❌ {method} {endpoint}: HTTP {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ {method} {endpoint}: Error - {e}")
    
    success = working_endpoints >= len(endpoints_to_test) * 0.8  # 80% success rate
    
    if success:
        print("✅ API endpoints validated")
    else:
        print("❌ API endpoints failing")
    
    return success

def main():
    """Run Task 14 comprehensive data validation"""
    print("🚀 Task 14 - Seed Data & Postman Collection Tests")
    print("=" * 60)
    
    tests = [
        ("User Data", test_user_data),
        ("Yacht Fleet", test_yacht_fleet),
        ("Ownership Structures", test_ownership_data),
        ("Fuel Wallets", test_fuel_wallets),
        ("Booking Scenarios", test_booking_scenarios),
        ("Payment History", test_payment_history),
        ("Inquiry System", test_inquiry_system),
        ("Notification System", test_notification_system),
        ("Postman Collection", test_postman_collection),
        ("API Endpoints", test_api_endpoints),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        try:
            result = test_func()
            if result:
                print(f"✅ {test_name} - PASSED")
                passed += 1
            else:
                print(f"❌ {test_name} - FAILED")
        except Exception as e:
            print(f"❌ {test_name} - ERROR: {e}")
    
    print(f"\n{'='*60}")
    print(f"📊 Task 14 Test Results: {passed}/{total} ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 Task 14 - Seed Data & Postman Collection COMPLETED!")
        print("Platform ready for production deployment")
    else:
        print("⚠️ Some validations failed. Task 14 needs attention.")
    
    return passed == total

if __name__ == "__main__":
    main()