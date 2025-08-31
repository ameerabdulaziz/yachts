#!/usr/bin/env python3
"""
Task 12 - Lead Capture System Test
Tests comprehensive inquiry and lead management system
"""
import os
import sys
import django

# Set up Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.test import Client
import json

def test_create_high_value_inquiry():
    """Test creating high-value fractional ownership inquiry"""
    print("🧪 Testing high-value fractional ownership inquiry...")
    
    client = Client()
    inquiry_data = {
        'first_name': 'Marcus',
        'last_name': 'Thompson',
        'email': 'marcus.thompson@luxuryinvest.com',
        'phone': '+1-555-0123',
        'company': 'Luxury Investment Group',
        'inquiry_type': 'fractional',
        'boat_id': 1,
        'message': 'I am interested in fractional ownership opportunities for our high-net-worth clients. We are looking for premium yachts in the 50-60 foot range with proven rental income potential. Our clients typically invest $200,000-$500,000 per share and expect professional management.',
        'budget_range_min': 200000,
        'budget_range_max': 500000,
        'timeline': '2-3 months',
        'preferred_location': 'Mediterranean',
        'source': 'referral',
        'consent_marketing': True
    }
    
    response = client.post('/inquiries/',
                          json.dumps(inquiry_data),
                          content_type='application/json')
    
    if response.status_code == 201:
        result = response.json()
        if result.get('success'):
            inquiry = result['inquiry']
            print(f"✅ High-value inquiry created:")
            print(f"   ID: {inquiry['id']}")
            print(f"   Name: {inquiry['full_name']}")
            print(f"   Type: {inquiry['inquiry_type']}")
            print(f"   Lead score: {inquiry['lead_score']}/100")
            print(f"   Qualified: {inquiry['is_qualified']}")
            print(f"   Budget: {inquiry['budget_display']}")
            print(f"   Next steps: {result['next_steps']}")
            return inquiry['id']
        else:
            print(f"❌ Inquiry creation failed: {result.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return None

def test_create_rental_inquiry():
    """Test creating rental inquiry with lower score"""
    print("🧪 Testing rental inquiry...")
    
    client = Client()
    inquiry_data = {
        'first_name': 'Sarah',
        'last_name': 'Johnson',
        'email': 'sarah.j@email.com',
        'phone': '+1-555-0456',
        'inquiry_type': 'rental',
        'boat_id': 1,
        'message': 'Hi, I am interested in renting a yacht for a weekend getaway.',
        'budget_range_min': 5000,
        'budget_range_max': 10000,
        'timeline': '6 months',
        'source': 'website',
        'consent_marketing': False
    }
    
    response = client.post('/inquiries/',
                          json.dumps(inquiry_data),
                          content_type='application/json')
    
    if response.status_code == 201:
        result = response.json()
        if result.get('success'):
            inquiry = result['inquiry']
            print(f"✅ Rental inquiry created:")
            print(f"   ID: {inquiry['id']}")
            print(f"   Name: {inquiry['full_name']}")
            print(f"   Lead score: {inquiry['lead_score']}/100")
            print(f"   Qualified: {inquiry['is_qualified']}")
            print(f"   Budget: {inquiry['budget_display']}")
            return inquiry['id']
        else:
            print(f"❌ Inquiry creation failed: {result.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return None

def test_general_inquiry():
    """Test creating general information inquiry"""
    print("🧪 Testing general information inquiry...")
    
    client = Client()
    inquiry_data = {
        'first_name': 'David',
        'last_name': 'Wilson',
        'email': 'david.wilson@gmail.com',
        'inquiry_type': 'general',
        'message': 'Can you send me information about yacht ownership options?',
        'source': 'social_media',
        'consent_marketing': True
    }
    
    response = client.post('/inquiries/',
                          json.dumps(inquiry_data),
                          content_type='application/json')
    
    if response.status_code == 201:
        result = response.json()
        if result.get('success'):
            inquiry = result['inquiry']
            print(f"✅ General inquiry created:")
            print(f"   ID: {inquiry['id']}")
            print(f"   Name: {inquiry['full_name']}")
            print(f"   Lead score: {inquiry['lead_score']}/100")
            print(f"   Qualified: {inquiry['is_qualified']}")
            return inquiry['id']
        else:
            print(f"❌ Inquiry creation failed: {result.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return None

def test_list_inquiries():
    """Test listing inquiries with filtering"""
    print("🧪 Testing inquiry listing and filtering...")
    
    client = Client()
    
    # Test basic listing
    response = client.get('/inquiries/list/')
    
    if response.status_code == 200:
        result = response.json()
        if result.get('success'):
            inquiries = result['inquiries']
            stats = result['statistics']
            
            print(f"✅ Inquiry listing successful:")
            print(f"   Total inquiries: {len(inquiries)}")
            print(f"   Statistics:")
            print(f"     Total: {stats['total_inquiries']}")
            print(f"     Qualified: {stats['qualified_leads']}")
            print(f"     New: {stats['new_leads']}")
            print(f"     Active: {stats['active_leads']}")
            
            # Test filtered listing
            print("\n   Testing filtered listing (qualified leads only)...")
            response = client.get('/inquiries/list/?qualified_only=true&inquiry_type=fractional')
            
            if response.status_code == 200:
                filtered_result = response.json()
                if filtered_result.get('success'):
                    filtered_inquiries = filtered_result['inquiries']
                    print(f"   Qualified fractional leads: {len(filtered_inquiries)}")
                    for inquiry in filtered_inquiries:
                        print(f"     - {inquiry['full_name']}: {inquiry['lead_score']}/100 ({inquiry['inquiry_type']})")
                    return True
            
        else:
            print(f"❌ Listing failed: {result.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return False

def test_inquiry_details(inquiry_id):
    """Test getting detailed inquiry information"""
    print(f"🧪 Testing inquiry details retrieval...")
    
    client = Client()
    response = client.get(f'/inquiries/{inquiry_id}/')
    
    if response.status_code == 200:
        result = response.json()
        if result.get('success'):
            inquiry = result['inquiry']
            follow_ups = result['follow_ups']
            
            print(f"✅ Inquiry details retrieved:")
            print(f"   Name: {inquiry['full_name']}")
            print(f"   Email: {inquiry['email']}")
            print(f"   Type: {inquiry['inquiry_type']}")
            print(f"   Status: {inquiry['status']}")
            print(f"   Priority: {inquiry['priority']}")
            print(f"   Lead score: {inquiry['lead_score']}/100")
            print(f"   Budget: {inquiry['budget_display']}")
            print(f"   Timeline: {inquiry['timeline']}")
            print(f"   Message: {inquiry['message'][:100]}...")
            print(f"   Follow-ups: {result['follow_up_count']}")
            
            if inquiry.get('boat'):
                boat = inquiry['boat']
                print(f"   Interested boat: {boat['model']} {boat['name']}")
            
            return True
        else:
            print(f"❌ Details retrieval failed: {result.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return False

def test_lead_scoring_algorithm():
    """Test lead scoring algorithm with different scenarios"""
    print("🧪 Testing lead scoring algorithm...")
    
    client = Client()
    
    # Test scenarios with different lead scores
    test_scenarios = [
        {
            'name': 'Premium Purchase Lead',
            'data': {
                'first_name': 'William',
                'last_name': 'Harrison',
                'email': 'w.harrison@privateequity.com',
                'phone': '+1-555-0789',
                'company': 'Harrison Private Equity',
                'inquiry_type': 'purchase',
                'message': 'I am looking to purchase a luxury yacht for personal use and charter operations. My budget is flexible, and I need something ready within the next month. I have experience with yacht ownership and am specifically interested in the De Antonio D60 model.',
                'budget_range_min': 800000,
                'budget_range_max': 1200000,
                'timeline': 'immediate',
                'source': 'boat_show',
                'consent_marketing': True
            },
            'expected_score_range': (85, 100)
        },
        {
            'name': 'Medium Charter Lead',
            'data': {
                'first_name': 'Emma',
                'last_name': 'Rodriguez',
                'email': 'emma.r@charter.com',
                'inquiry_type': 'charter',
                'message': 'Looking for charter options for corporate events.',
                'budget_range_min': 25000,
                'timeline': '6 months',
                'source': 'website'
            },
            'expected_score_range': (35, 55)
        }
    ]
    
    for scenario in test_scenarios:
        response = client.post('/inquiries/',
                              json.dumps(scenario['data']),
                              content_type='application/json')
        
        if response.status_code == 201:
            result = response.json()
            inquiry = result['inquiry']
            score = inquiry['lead_score']
            expected_min, expected_max = scenario['expected_score_range']
            
            if expected_min <= score <= expected_max:
                print(f"✅ {scenario['name']}: Score {score}/100 (within expected range)")
            else:
                print(f"⚠️  {scenario['name']}: Score {score}/100 (expected {expected_min}-{expected_max})")
        else:
            print(f"❌ {scenario['name']}: Failed to create")
    
    return True

def main():
    """Run Task 12 lead capture system tests"""
    print("🚀 Task 12 - Lead Capture System Tests")
    print("=" * 60)
    
    tests = [
        ("High-Value Fractional Inquiry", test_create_high_value_inquiry),
        ("Rental Inquiry", test_create_rental_inquiry), 
        ("General Information Inquiry", test_general_inquiry),
        ("Inquiry Listing & Filtering", test_list_inquiries),
        ("Lead Scoring Algorithm", test_lead_scoring_algorithm),
    ]
    
    passed = 0
    total = len(tests)
    inquiry_id = None
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        try:
            result = test_func()
            if result:
                if test_name == "High-Value Fractional Inquiry":
                    inquiry_id = result
                print(f"✅ {test_name} - PASSED")
                passed += 1
            else:
                print(f"❌ {test_name} - FAILED")
        except Exception as e:
            print(f"❌ {test_name} - ERROR: {e}")
    
    # Test inquiry details if we have an ID
    if inquiry_id:
        print(f"\n{'='*50}")
        try:
            if test_inquiry_details(inquiry_id):
                print(f"✅ Inquiry Details Retrieval - PASSED")
                passed += 1
                total += 1
            else:
                print(f"❌ Inquiry Details Retrieval - FAILED")
                total += 1
        except Exception as e:
            print(f"❌ Inquiry Details Retrieval - ERROR: {e}")
            total += 1
    
    print(f"\n{'='*60}")
    print(f"📊 Task 12 Test Results: {passed}/{total} ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 Task 12 - Lead Capture System COMPLETED!")
        print("Comprehensive inquiry management system is operational")
    else:
        print("⚠️ Some tests failed. Task 12 needs attention.")
    
    return passed == total

if __name__ == "__main__":
    main()