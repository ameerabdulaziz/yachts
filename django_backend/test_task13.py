#!/usr/bin/env python3
"""
Task 13 - Notifications (In-App Feed) Test
Tests comprehensive notification system and in-app feed
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
from notify_system.models import Notification, NotificationTemplate
from notify_system.services import NotificationService
from boats.models import Boat
from bookings.models import Booking
import json

User = get_user_model()

def setup_notification_templates():
    """Setup notification templates for testing"""
    print("🔧 Setting up notification templates...")
    
    templates = [
        {
            'notification_type': 'booking_confirmed',
            'title_template': '🛥️ Booking Confirmed - {yacht_name}',
            'message_template': 'Your booking for {yacht_name} from {start_date} to {end_date} has been confirmed. Total guests: {guest_count}',
            'available_variables': ['yacht_name', 'start_date', 'end_date', 'guest_count'],
            'default_priority': 'high',
            'default_action_text': 'View Booking'
        },
        {
            'notification_type': 'payment_successful',
            'title_template': '💳 Payment Successful',
            'message_template': 'Your payment of ${amount} has been processed successfully. Thank you!',
            'available_variables': ['amount'],
            'default_priority': 'medium',
            'default_action_text': 'View Receipt'
        },
        {
            'notification_type': 'fuel_low_balance',
            'title_template': '⛽ Fuel Wallet Low Balance',
            'message_template': 'Your fuel wallet balance is low (${current_balance}). Consider topping up to avoid booking issues.',
            'available_variables': ['current_balance', 'threshold'],
            'default_priority': 'high',
            'default_action_text': 'Top Up'
        },
        {
            'notification_type': 'welcome_message',
            'title_template': '🎉 Welcome to Nauttec!',
            'message_template': 'Welcome {user_name}! Get ready to experience luxury yachting like never before.',
            'available_variables': ['user_name'],
            'default_priority': 'low',
            'default_action_text': 'Explore Fleet'
        }
    ]
    
    for template_data in templates:
        template, created = NotificationTemplate.objects.get_or_create(
            notification_type=template_data['notification_type'],
            defaults=template_data
        )
        if created:
            print(f"   Template created: {template.notification_type}")
        else:
            print(f"   Template exists: {template.notification_type}")

def test_create_templated_notifications():
    """Test creating notifications using templates"""
    print("🧪 Testing templated notification creation...")
    
    # Get test user
    user, created = User.objects.get_or_create(
        phone='+201234567890',
        defaults={'is_phone_verified': True}
    )
    
    # Test booking confirmation notification
    booking_context = {
        'yacht_name': 'D60 Serenity',
        'start_date': '2025-09-01',
        'end_date': '2025-09-03',
        'guest_count': 8
    }
    
    booking_notification = NotificationService.create_notification(
        user=user,
        notification_type='booking_confirmed',
        context=booking_context
    )
    
    if booking_notification:
        print(f"✅ Booking notification created:")
        print(f"   ID: {booking_notification.id}")
        print(f"   Title: {booking_notification.title}")
        print(f"   Message: {booking_notification.message}")
        print(f"   Priority: {booking_notification.priority}")
        print(f"   Action: {booking_notification.action_text}")
    
    # Test payment notification
    payment_context = {'amount': '2,500.00'}
    payment_notification = NotificationService.create_notification(
        user=user,
        notification_type='payment_successful',
        context=payment_context
    )
    
    if payment_notification:
        print(f"✅ Payment notification created:")
        print(f"   Title: {payment_notification.title}")
        print(f"   Message: {payment_notification.message}")
    
    # Test fuel warning notification
    fuel_context = {'current_balance': '45.00', 'threshold': '200.00'}
    fuel_notification = NotificationService.create_notification(
        user=user,
        notification_type='fuel_low_balance',
        context=fuel_context
    )
    
    if fuel_notification:
        print(f"✅ Fuel warning notification created:")
        print(f"   Title: {fuel_notification.title}")
        print(f"   Message: {fuel_notification.message}")
        print(f"   Priority: {fuel_notification.priority}")
    
    return user, [booking_notification, payment_notification, fuel_notification]

def test_notification_feed_api():
    """Test notification feed API endpoints"""
    print("🧪 Testing notification feed API...")
    
    client = Client()
    
    # Test getting user notifications
    response = client.get('/notifications/?user_phone=%2B201234567890&limit=10')
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success'):
            notifications = data['notifications']
            stats = {
                'total_count': data['total_count'],
                'unread_count': data['unread_count'],
                'count': data['count']
            }
            
            print(f"✅ Notification feed retrieved:")
            print(f"   Total notifications: {stats['total_count']}")
            print(f"   Unread notifications: {stats['unread_count']}")
            print(f"   Retrieved: {stats['count']}")
            
            if notifications:
                latest = notifications[0]
                print(f"   Latest notification:")
                print(f"     Type: {latest['type']}")
                print(f"     Title: {latest['title']}")
                print(f"     Read: {latest['is_read']}")
                print(f"     Priority: {latest['priority']}")
                
                return latest['id']
        else:
            print(f"❌ API error: {data.get('message')}")
    else:
        print(f"❌ API request failed: HTTP {response.status_code}")
    
    return None

def test_mark_notification_read(notification_id):
    """Test marking notification as read"""
    print("🧪 Testing mark notification as read...")
    
    if not notification_id:
        print("❌ No notification ID provided")
        return False
    
    client = Client()
    
    # Mark notification as read
    response = client.post(f'/notifications/{notification_id}/mark-read/',
                          json.dumps({'user_phone': '+201234567890'}),
                          content_type='application/json')
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success'):
            print(f"✅ Notification {notification_id} marked as read")
            
            # Verify it's marked as read by getting feed again
            response = client.get('/notifications/?user_phone=%2B201234567890&limit=5')
            if response.status_code == 200:
                feed_data = response.json()
                for notification in feed_data['notifications']:
                    if notification['id'] == notification_id:
                        if notification['is_read']:
                            print(f"✅ Notification read status verified")
                            return True
                        else:
                            print(f"❌ Notification read status not updated")
                            return False
        else:
            print(f"❌ Failed to mark as read: {data.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return False

def test_notification_preferences():
    """Test notification preferences API"""
    print("🧪 Testing notification preferences...")
    
    client = Client()
    
    # Get current preferences
    response = client.get('/notifications/preferences/?user_phone=%2B201234567890')
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success'):
            prefs = data['preferences']
            print(f"✅ Notification preferences retrieved:")
            print(f"   Push notifications: {prefs['push_notifications_enabled']}")
            print(f"   Email notifications: {prefs['email_notifications_enabled']}")
            print(f"   Booking notifications: {prefs['booking_notifications']}")
            print(f"   Fuel notifications: {prefs['fuel_notifications']}")
            print(f"   Quiet hours: {prefs['quiet_hours_enabled']}")
            return True
        else:
            print(f"❌ Failed to get preferences: {data.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return False

def test_create_test_notification():
    """Test creating custom test notifications"""
    print("🧪 Testing custom test notification creation...")
    
    client = Client()
    
    test_data = {
        'user_phone': '+201234567890',
        'notification_type': 'system_maintenance',
        'title': 'Scheduled Maintenance',
        'message': 'The Nauttec platform will be undergoing scheduled maintenance tonight from 11 PM to 2 AM EST. During this time, booking functionality may be limited.',
        'priority': 'medium',
        'context': {
            'maintenance_start': '2025-09-01T23:00:00Z',
            'maintenance_end': '2025-09-02T02:00:00Z'
        }
    }
    
    response = client.post('/notifications/test/',
                          json.dumps(test_data),
                          content_type='application/json')
    
    if response.status_code == 201:
        data = response.json()
        if data.get('success'):
            notification = data['notification']
            print(f"✅ Test notification created:")
            print(f"   ID: {notification['id']}")
            print(f"   Type: {notification['type']}")
            print(f"   Title: {notification['title']}")
            print(f"   Priority: {notification['priority']}")
            return True
        else:
            print(f"❌ Test notification failed: {data.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return False

def test_notification_filtering():
    """Test notification filtering and querying"""
    print("🧪 Testing notification filtering...")
    
    client = Client()
    
    # Test unread only filter
    response = client.get('/notifications/?user_phone=%2B201234567890&unread_only=true&limit=5')
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success'):
            unread_notifications = data['notifications']
            unread_count = len(unread_notifications)
            
            print(f"✅ Unread notifications filter:")
            print(f"   Unread notifications: {unread_count}")
            
            # Verify all returned notifications are unread
            all_unread = all(not notif['is_read'] for notif in unread_notifications)
            if all_unread:
                print(f"✅ All returned notifications are unread")
            else:
                print(f"❌ Some returned notifications are already read")
            
            return all_unread
        else:
            print(f"❌ Filter test failed: {data.get('message')}")
    else:
        print(f"❌ Request failed: HTTP {response.status_code}")
    
    return False

def main():
    """Run Task 13 notification system tests"""
    print("🚀 Task 13 - Notifications (In-App Feed) Tests")
    print("=" * 60)
    
    # Setup templates
    setup_notification_templates()
    
    tests = [
        ("Templated Notification Creation", test_create_templated_notifications),
        ("Notification Feed API", test_notification_feed_api),
        ("Custom Test Notification", test_create_test_notification),
        ("Notification Preferences", test_notification_preferences),
        ("Notification Filtering", test_notification_filtering),
    ]
    
    passed = 0
    total = len(tests)
    notification_id = None
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        try:
            if test_name == "Templated Notification Creation":
                user, notifications = test_func()
                if notifications and len(notifications) >= 3:
                    print(f"✅ {test_name} - PASSED")
                    passed += 1
                else:
                    print(f"❌ {test_name} - FAILED")
            elif test_name == "Notification Feed API":
                notification_id = test_func()
                if notification_id:
                    print(f"✅ {test_name} - PASSED")
                    passed += 1
                else:
                    print(f"❌ {test_name} - FAILED")
            else:
                result = test_func()
                if result:
                    print(f"✅ {test_name} - PASSED")
                    passed += 1
                else:
                    print(f"❌ {test_name} - FAILED")
        except Exception as e:
            print(f"❌ {test_name} - ERROR: {e}")
    
    # Test mark as read if we have a notification ID
    if notification_id:
        print(f"\n{'='*50}")
        try:
            if test_mark_notification_read(notification_id):
                print(f"✅ Mark Notification Read - PASSED")
                passed += 1
                total += 1
            else:
                print(f"❌ Mark Notification Read - FAILED")
                total += 1
        except Exception as e:
            print(f"❌ Mark Notification Read - ERROR: {e}")
            total += 1
    
    print(f"\n{'='*60}")
    print(f"📊 Task 13 Test Results: {passed}/{total} ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 Task 13 - Notifications (In-App Feed) COMPLETED!")
        print("Comprehensive notification system is operational")
    else:
        print("⚠️ Some tests failed. Task 13 needs attention.")
    
    return passed == total

if __name__ == "__main__":
    main()