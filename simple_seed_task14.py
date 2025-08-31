#!/usr/bin/env python3
"""
Task 14 - Simple Seed Data for Platform Testing
"""
import os
import sys
import django
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils import timezone

# Set up Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.contrib.auth import get_user_model
from boats.models import Boat
from bookings.models import Booking
from inquiries.models import Inquiry, LeadSource
from notify_system.models import Notification
from notify_system.services import NotificationService

User = get_user_model()

def create_test_users():
    """Create test users"""
    print("👥 Creating test users...")
    
    users_data = [
        {'phone': '+201234567890', 'password': 'testpass123', 'name': 'Ahmed Hassan'},
        {'phone': '+33123456789', 'password': 'testpass123', 'name': 'Pierre Dubois'},
        {'phone': '+34987654321', 'password': 'testpass123', 'name': 'Isabella Rodriguez'},
        {'phone': '+447123456789', 'password': 'testpass123', 'name': 'James Thompson'},
        {'phone': '+393456789012', 'password': 'testpass123', 'name': 'Marco Bianchi'},
    ]
    
    created_users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            phone=user_data['phone'],
            defaults={'is_phone_verified': True}
        )
        if created:
            user.set_password(user_data['password'])
            user.save()
            print(f"   Created: {user_data['name']} ({user_data['phone']})")
        else:
            print(f"   Exists: {user_data['name']} ({user_data['phone']})")
        
        created_users.append(user)
    
    return created_users

def create_yacht_data():
    """Create comprehensive yacht data"""
    print("🛥️ Creating yacht data...")
    
    yachts_data = [
        {
            'name': 'Mediterranean Dream',
            'model': 'D29',
            'year': 2023,
            'location': 'Monaco',
            'daily_rate': Decimal('1200.00'),
            'capacity': 8,
            'length': '29 feet'
        },
        {
            'name': 'Adriatic Explorer',
            'model': 'D33',
            'year': 2023,
            'location': 'Split, Croatia',
            'daily_rate': Decimal('1800.00'),
            'capacity': 10,
            'length': '33 feet'
        },
        {
            'name': 'Balearic Beauty',
            'model': 'D42',
            'year': 2024,
            'location': 'Palma, Mallorca',
            'daily_rate': Decimal('2800.00'),
            'capacity': 12,
            'length': '42 feet'
        },
        {
            'name': 'Aegean Voyager',
            'model': 'D50',
            'year': 2024,
            'location': 'Mykonos, Greece',
            'daily_rate': Decimal('4200.00'),
            'capacity': 14,
            'length': '50 feet'
        },
        {
            'name': 'Riviera Prestige',
            'model': 'D60',
            'year': 2024,
            'location': 'Nice, France',
            'daily_rate': Decimal('6500.00'),
            'capacity': 16,
            'length': '60 feet'
        }
    ]
    
    created_yachts = []
    for yacht_data in yachts_data:
        yacht, created = Boat.objects.get_or_create(
            name=yacht_data['name'],
            defaults=yacht_data
        )
        if created:
            print(f"   Created: {yacht_data['name']} ({yacht_data['model']})")
        else:
            print(f"   Exists: {yacht_data['name']} ({yacht_data['model']})")
        
        created_yachts.append(yacht)
    
    return created_yachts

def create_bookings_data(users, yachts):
    """Create booking data"""
    print("📅 Creating booking data...")
    
    bookings_data = [
        {
            'user': users[0],
            'yacht': yachts[0],
            'start_date': timezone.now().date() + timedelta(days=7),
            'end_date': timezone.now().date() + timedelta(days=9),
            'guest_count': 6,
            'status': 'confirmed'
        },
        {
            'user': users[1],
            'yacht': yachts[1],
            'start_date': timezone.now().date() + timedelta(days=14),
            'end_date': timezone.now().date() + timedelta(days=16),
            'guest_count': 8,
            'status': 'confirmed'
        },
        {
            'user': users[2],
            'yacht': yachts[2],
            'start_date': timezone.now().date() + timedelta(days=21),
            'end_date': timezone.now().date() + timedelta(days=24),
            'guest_count': 10,
            'status': 'pending'
        }
    ]
    
    created_bookings = []
    for booking_data in bookings_data:
        days = (booking_data['end_date'] - booking_data['start_date']).days
        total_cost = booking_data['yacht'].daily_rate * days
        
        booking, created = Booking.objects.get_or_create(
            user=booking_data['user'],
            boat=booking_data['yacht'],
            start_date=booking_data['start_date'],
            end_date=booking_data['end_date'],
            defaults={
                'guest_count': booking_data['guest_count'],
                'total_cost': total_cost,
                'status': booking_data['status']
            }
        )
        
        if created:
            print(f"   Created booking: {booking_data['yacht'].name} for {booking_data['user'].phone}")
            created_bookings.append(booking)
    
    return created_bookings

def create_inquiry_data(users, yachts):
    """Create inquiry data"""
    print("🎯 Creating inquiry data...")
    
    # Create lead sources
    lead_sources_data = [
        {'name': 'Website Contact Form'},
        {'name': 'Monaco Yacht Show'},
        {'name': 'Referral Program'},
        {'name': 'Social Media'}
    ]
    
    for source_data in lead_sources_data:
        LeadSource.objects.get_or_create(name=source_data['name'])
        print(f"   Lead source: {source_data['name']}")
    
    # Create inquiries
    inquiries_data = [
        {
            'first_name': 'Alexandra',
            'last_name': 'Petrov',
            'email': 'alexandra.petrov@luxury.com',
            'phone': '+33654789123',
            'inquiry_type': 'fractional',
            'boat': yachts[3],
            'message': 'Interested in fractional ownership of premium vessels.',
            'budget_range_min': 300000,
            'budget_range_max': 600000,
            'source': 'referral'
        },
        {
            'first_name': 'Robert',
            'last_name': 'Mitchell',
            'email': 'rmitchell@corporate.co.uk',
            'phone': '+447891234567',
            'inquiry_type': 'charter',
            'boat': yachts[4],
            'message': 'Corporate retreat yacht charter for executives.',
            'budget_range_min': 15000,
            'budget_range_max': 25000,
            'source': 'website'
        }
    ]
    
    created_inquiries = []
    for inquiry_data in inquiries_data:
        inquiry, created = Inquiry.objects.get_or_create(
            email=inquiry_data['email'],
            defaults=inquiry_data
        )
        
        if created:
            print(f"   Created inquiry: {inquiry_data['first_name']} {inquiry_data['last_name']}")
            created_inquiries.append(inquiry)
    
    return created_inquiries

def create_notification_data(users):
    """Create notification data"""
    print("🔔 Creating notification data...")
    
    notifications_data = [
        {
            'user': users[0],
            'type': 'booking_confirmed',
            'context': {'yacht_name': 'Mediterranean Dream', 'start_date': '2025-09-07'}
        },
        {
            'user': users[1],
            'type': 'payment_successful',
            'context': {'amount': '3,600.00'}
        },
        {
            'user': users[2],
            'type': 'welcome_message',
            'context': {'user_name': 'Isabella Rodriguez'}
        }
    ]
    
    created_notifications = []
    for notif_data in notifications_data:
        try:
            notification = NotificationService.create_notification(
                user=notif_data['user'],
                notification_type=notif_data['type'],
                context=notif_data['context']
            )
            print(f"   Created notification: {notif_data['type']} for {notif_data['user'].phone}")
            created_notifications.append(notification)
        except Exception as e:
            print(f"   ⚠️ Notification creation skipped: {e}")
    
    return created_notifications

def main():
    """Main function to populate test data"""
    print("🚀 Task 14 - Simple Seed Data Setup")
    print("=" * 50)
    
    try:
        users = create_test_users()
        yachts = create_yacht_data()
        bookings = create_bookings_data(users, yachts)
        inquiries = create_inquiry_data(users, yachts)
        notifications = create_notification_data(users)
        
        print(f"\n{'='*50}")
        print("📊 Seed Data Summary:")
        print(f"👥 Users: {len(users)}")
        print(f"🛥️ Yachts: {len(yachts)}")
        print(f"📅 Bookings: {len(bookings)}")
        print(f"🎯 Inquiries: {len(inquiries)}")
        print(f"🔔 Notifications: {len(notifications)}")
        
        print(f"\n🎉 Task 14 - Seed data setup completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error during seed data setup: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    main()