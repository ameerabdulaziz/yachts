#!/usr/bin/env python3
"""
Task 14 - Seed Data & Postman Collection Setup
Comprehensive test data population for yacht platform
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
from ownership.models import FractionalOwnership, FuelWallet
from payment_system.models import PaymentIntent
from inquiries.models import Inquiry, InquiryFollowUp, LeadSource
from notify_system.models import Notification, NotificationTemplate, NotificationPreference
from notify_system.services import NotificationService

User = get_user_model()

def create_comprehensive_users():
    """Create diverse user base for testing"""
    print("👥 Creating comprehensive user base...")
    
    users_data = [
        {
            'phone': '+201234567890',
            'password': 'testpass123',
            'is_phone_verified': True,
            'role': 'renter',
            'profile': {'name': 'Ahmed Hassan', 'location': 'Cairo, Egypt'}
        },
        {
            'phone': '+33123456789',
            'password': 'testpass123',
            'is_phone_verified': True,
            'role': 'owner',
            'profile': {'name': 'Pierre Dubois', 'location': 'Monaco'}
        },
        {
            'phone': '+34987654321',
            'password': 'testpass123',
            'is_phone_verified': True,
            'role': 'owner',
            'profile': {'name': 'Isabella Rodriguez', 'location': 'Mallorca, Spain'}
        },
        {
            'phone': '+447123456789',
            'password': 'testpass123',
            'is_phone_verified': True,
            'role': 'renter',
            'profile': {'name': 'James Thompson', 'location': 'London, UK'}
        },
        {
            'phone': '+393456789012',
            'password': 'testpass123',
            'is_phone_verified': True,
            'role': 'owner',
            'profile': {'name': 'Marco Bianchi', 'location': 'Portofino, Italy'}
        },
        {
            'phone': '+4915123456789',
            'password': 'testpass123',
            'is_phone_verified': True,
            'role': 'admin',
            'profile': {'name': 'Klaus Weber', 'location': 'Hamburg, Germany'}
        }
    ]
    
    created_users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            phone=user_data['phone'],
            defaults={
                'is_phone_verified': user_data['is_phone_verified'],
                'role': user_data['role']
            }
        )
        if created:
            user.set_password(user_data['password'])
            user.save()
            print(f"   Created user: {user_data['profile']['name']} ({user_data['role']})")
        else:
            print(f"   User exists: {user_data['profile']['name']} ({user_data['role']})")
        
        created_users.append((user, user_data['profile']))
    
    return created_users

def create_extended_yacht_fleet():
    """Create comprehensive yacht fleet"""
    print("🛥️ Creating extended yacht fleet...")
    
    yachts_data = [
        {
            'name': 'Mediterranean Dream',
            'model': 'D29',
            'year': 2023,
            'location': 'Monaco',
            'daily_rate': Decimal('1200.00'),
            'capacity': 8,
            'specifications': {
                'length': '29 feet',
                'beam': '10 feet',
                'engines': 'Twin 300hp',
                'fuel_capacity': '400L',
                'amenities': ['WiFi', 'Sound System', 'Sun Deck', 'Swim Platform']
            }
        },
        {
            'name': 'Adriatic Explorer',
            'model': 'D33',
            'year': 2023,
            'location': 'Split, Croatia',
            'daily_rate': Decimal('1800.00'),
            'capacity': 10,
            'specifications': {
                'length': '33 feet',
                'beam': '11 feet',
                'engines': 'Twin 350hp',
                'fuel_capacity': '500L',
                'amenities': ['WiFi', 'Premium Sound', 'Kitchen', 'Bathroom', 'Sun Deck']
            }
        },
        {
            'name': 'Balearic Beauty',
            'model': 'D42',
            'year': 2024,
            'location': 'Palma, Mallorca',
            'daily_rate': Decimal('2800.00'),
            'capacity': 12,
            'specifications': {
                'length': '42 feet',
                'beam': '13 feet',
                'engines': 'Twin 450hp',
                'fuel_capacity': '800L',
                'amenities': ['WiFi', 'Premium Sound', 'Full Kitchen', '2 Bathrooms', 'Master Cabin']
            }
        },
        {
            'name': 'Aegean Voyager',
            'model': 'D50',
            'year': 2024,
            'location': 'Mykonos, Greece',
            'daily_rate': Decimal('4200.00'),
            'capacity': 14,
            'specifications': {
                'length': '50 feet',
                'beam': '15 feet',
                'engines': 'Twin 600hp',
                'fuel_capacity': '1200L',
                'amenities': ['WiFi', 'Premium Audio', 'Full Kitchen', '3 Bathrooms', '2 Cabins', 'Jacuzzi']
            }
        },
        {
            'name': 'Riviera Prestige',
            'model': 'D60',
            'year': 2024,
            'location': 'Nice, France',
            'daily_rate': Decimal('6500.00'),
            'capacity': 16,
            'specifications': {
                'length': '60 feet',
                'beam': '17 feet',
                'engines': 'Twin 800hp',
                'fuel_capacity': '1800L',
                'amenities': ['WiFi', 'Premium Audio/Video', 'Gourmet Kitchen', '4 Bathrooms', '3 Cabins', 'Jacuzzi', 'Water Sports Equipment']
            }
        }
    ]
    
    created_yachts = []
    for yacht_data in yachts_data:
        yacht, created = Boat.objects.get_or_create(
            name=yacht_data['name'],
            defaults=yacht_data
        )
        if created:
            print(f"   Created yacht: {yacht_data['name']} ({yacht_data['model']})")
        else:
            print(f"   Yacht exists: {yacht_data['name']} ({yacht_data['model']})")
        
        created_yachts.append(yacht)
    
    return created_yachts

def create_ownership_structures(users, yachts):
    """Create fractional ownership structures"""
    print("🏠 Creating fractional ownership structures...")
    
    # Find owners
    owners = [user for user, profile in users if user.role == 'owner']
    
    ownership_data = [
        {
            'yacht': yachts[2],  # D42 Balearic Beauty
            'owners': [
                {'user': owners[0], 'share_percentage': '1/2', 'purchase_price': Decimal('120000.00')},
                {'user': owners[1], 'share_percentage': '1/2', 'purchase_price': Decimal('120000.00')}
            ]
        },
        {
            'yacht': yachts[3],  # D50 Aegean Voyager
            'owners': [
                {'user': owners[0], 'share_percentage': '1/2', 'purchase_price': Decimal('200000.00')},
                {'user': owners[1], 'share_percentage': '1/2', 'purchase_price': Decimal('200000.00')}
            ]
        },
        {
            'yacht': yachts[4],  # D60 Riviera Prestige
            'owners': [
                {'user': owners[2], 'share_percentage': 'full', 'purchase_price': Decimal('450000.00')}
            ]
        }
    ]
    
    created_ownerships = []
    for ownership in ownership_data:
        yacht = ownership['yacht']
        print(f"   Setting up ownership for {yacht.name}:")
        
        for owner_data in ownership['owners']:
            yacht_ownership, created = FractionalOwnership.objects.get_or_create(
                owner=owner_data['user'],
                boat=yacht,
                defaults={
                    'share_percentage': owner_data['share_percentage'],
                    'purchase_price': owner_data['purchase_price'],
                    'purchase_date': timezone.now().date() - timedelta(days=180),
                    'annual_day_limit': 48,
                    'current_year_days_used': 12
                }
            )
            
            if created:
                print(f"     {owner_data['user'].phone}: {owner_data['share_percentage']} share")
                created_ownerships.append(yacht_ownership)
    
    return created_ownerships

def create_fuel_wallets(users):
    """Create fuel wallets with various balances"""
    print("⛽ Creating fuel wallets...")
    
    fuel_data = [
        {'user': users[0][0], 'balance': Decimal('850.00')},
        {'user': users[1][0], 'balance': Decimal('1200.00')},
        {'user': users[2][0], 'balance': Decimal('45.00')},  # Low balance
        {'user': users[3][0], 'balance': Decimal('600.00')},
        {'user': users[4][0], 'balance': Decimal('2100.00')}
    ]
    
    created_wallets = []
    for wallet_data in fuel_data:
        wallet, created = FuelWallet.objects.get_or_create(
            owner=wallet_data['user'],
            defaults={
                'current_balance': wallet_data['balance'],
                'low_balance_threshold': Decimal('200.00'),
                'auto_topup_enabled': True,
                'auto_topup_amount': Decimal('500.00')
            }
        )
        
        if created:
            
            print(f"   Created wallet for {wallet_data['user'].phone}: ${wallet_data['balance']}")
            created_wallets.append(wallet)
    
    return created_wallets

def create_diverse_bookings(users, yachts):
    """Create diverse booking scenarios"""
    print("📅 Creating diverse booking scenarios...")
    
    # Get renters and owners
    renters = [user for user, profile in users if user.role == 'renter']
    owners = [user for user, profile in users if user.role == 'owner']
    
    bookings_data = [
        {
            'user': renters[0],
            'yacht': yachts[0],
            'start_date': timezone.now().date() + timedelta(days=7),
            'end_date': timezone.now().date() + timedelta(days=9),
            'guest_count': 6,
            'status': 'confirmed'
        },
        {
            'user': owners[0],
            'yacht': yachts[2],  # Own yacht
            'start_date': timezone.now().date() + timedelta(days=14),
            'end_date': timezone.now().date() + timedelta(days=16),
            'guest_count': 8,
            'status': 'confirmed'
        },
        {
            'user': renters[1],
            'yacht': yachts[1],
            'start_date': timezone.now().date() + timedelta(days=21),
            'end_date': timezone.now().date() + timedelta(days=24),
            'guest_count': 10,
            'status': 'confirmed'
        },
        {
            'user': owners[1],
            'yacht': yachts[3],  # Own yacht
            'start_date': timezone.now().date() + timedelta(days=28),
            'end_date': timezone.now().date() + timedelta(days=30),
            'guest_count': 12,
            'status': 'confirmed'
        },
        {
            'user': renters[0],
            'yacht': yachts[4],
            'start_date': timezone.now().date() + timedelta(days=35),
            'end_date': timezone.now().date() + timedelta(days=38),
            'guest_count': 14,
            'status': 'pending'
        }
    ]
    
    created_bookings = []
    for booking_data in bookings_data:
        # Calculate total cost
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
                'status': booking_data['status'],
                'special_requests': f'Premium charter experience for {booking_data["guest_count"]} guests'
            }
        )
        
        if created:
            yacht_name = booking_data['yacht'].name
            user_phone = booking_data['user'].phone
            print(f"   Created booking: {yacht_name} for {user_phone} ({booking_data['status']})")
            created_bookings.append(booking)
    
    return created_bookings

def create_payment_history(bookings):
    """Create payment history for bookings"""
    print("💳 Creating payment history...")
    
    created_payments = []
    for booking in bookings:
        if booking.status == 'confirmed':
            payment, created = PaymentIntent.objects.get_or_create(
                user=booking.user,
                amount=booking.total_cost,
                currency='USD',
                defaults={
                    'status': 'succeeded',
                    'stripe_payment_intent_id': f'pi_test_{booking.id}_{int(timezone.now().timestamp())}',
                    'description': f'Yacht booking: {booking.boat.name}',
                    'metadata': {
                        'booking_id': booking.id,
                        'yacht_name': booking.boat.name,
                        'dates': f'{booking.start_date} to {booking.end_date}'
                    }
                }
            )
            
            if created:
                print(f"   Payment: ${booking.total_cost} for {booking.boat.name}")
                created_payments.append(payment)
    
    return created_payments

def create_lead_sources_and_inquiries(users, yachts):
    """Create lead sources and inquiries"""
    print("🎯 Creating lead sources and inquiries...")
    
    # Create lead sources
    lead_sources_data = [
        {'name': 'Website Contact Form', 'total_leads': 25, 'qualified_leads': 18, 'closed_deals': 5},
        {'name': 'Monaco Yacht Show', 'total_leads': 15, 'qualified_leads': 12, 'closed_deals': 4},
        {'name': 'Referral Program', 'total_leads': 8, 'qualified_leads': 7, 'closed_deals': 3},
        {'name': 'Social Media', 'total_leads': 22, 'qualified_leads': 8, 'closed_deals': 1},
        {'name': 'Direct Email', 'total_leads': 12, 'qualified_leads': 9, 'closed_deals': 2}
    ]
    
    created_sources = []
    for source_data in lead_sources_data:
        source, created = LeadSource.objects.get_or_create(
            name=source_data['name'],
            defaults=source_data
        )
        if created:
            print(f"   Lead source: {source_data['name']}")
            created_sources.append(source)
    
    # Create inquiries
    inquiries_data = [
        {
            'first_name': 'Alexandra',
            'last_name': 'Petrov',
            'email': 'alexandra.petrov@luxurytravel.com',
            'phone': '+33654789123',
            'company': 'Luxury Travel Concierge',
            'inquiry_type': 'fractional',
            'yacht': yachts[3],
            'message': 'We represent high-net-worth clients interested in fractional yacht ownership. Looking for premium vessels in the 50+ foot range with proven charter income potential.',
            'budget_range_min': Decimal('300000.00'),
            'budget_range_max': Decimal('600000.00'),
            'timeline': '2-3 months',
            'source': 'referral',
            'status': 'qualified'
        },
        {
            'first_name': 'Robert',
            'last_name': 'Mitchell',
            'email': 'rmitchell@corporateevents.co.uk',
            'phone': '+447891234567',
            'company': 'Elite Corporate Events',
            'inquiry_type': 'charter',
            'yacht': yachts[4],
            'message': 'Planning a corporate retreat for 12-16 executives. Need luxury yacht charter for 3 days in Mediterranean.',
            'budget_range_min': Decimal('15000.00'),
            'budget_range_max': Decimal('25000.00'),
            'timeline': '1 month',
            'source': 'website',
            'status': 'contacted'
        },
        {
            'first_name': 'Sofia',
            'last_name': 'Rossi',
            'email': 'sofia.rossi@gmail.com',
            'phone': '+393451234567',
            'inquiry_type': 'rental',
            'yacht': yachts[1],
            'message': 'Looking for weekend yacht rental for family vacation. 6-8 people, prefer Croatian coastline.',
            'budget_range_min': Decimal('3000.00'),
            'budget_range_max': Decimal('5000.00'),
            'timeline': '6 months',
            'source': 'social_media',
            'status': 'new'
        }
    ]
    
    created_inquiries = []
    for inquiry_data in inquiries_data:
        inquiry, created = Inquiry.objects.get_or_create(
            email=inquiry_data['email'],
            defaults=inquiry_data
        )
        
        if created:
            # Calculate lead score
            from inquiries.views_task12 import calculate_lead_score
            inquiry.lead_score = calculate_lead_score(inquiry_data)
            inquiry.is_qualified = inquiry.lead_score >= 60
            inquiry.save()
            
            print(f"   Inquiry: {inquiry_data['first_name']} {inquiry_data['last_name']} ({inquiry_data['inquiry_type']}) - Score: {inquiry.lead_score}")
            created_inquiries.append(inquiry)
    
    return created_inquiries

def create_notifications(users):
    """Create diverse notifications"""
    print("🔔 Creating notification history...")
    
    notifications_data = [
        {
            'user': users[0][0],
            'type': 'booking_confirmed',
            'context': {
                'yacht_name': 'Mediterranean Dream',
                'start_date': '2025-09-07',
                'end_date': '2025-09-09',
                'guest_count': 6
            }
        },
        {
            'user': users[1][0],
            'type': 'payment_successful',
            'context': {'amount': '3,600.00'}
        },
        {
            'user': users[2][0],
            'type': 'fuel_low_balance',
            'context': {'current_balance': '45.00', 'threshold': '200.00'}
        },
        {
            'user': users[3][0],
            'type': 'welcome_message',
            'context': {'user_name': 'James Thompson'}
        },
        {
            'user': users[4][0],
            'type': 'ownership_share_available',
            'context': {'yacht_name': 'D42 Balearic Beauty', 'share_percentage': '15.00'}
        }
    ]
    
    created_notifications = []
    for notif_data in notifications_data:
        notification = NotificationService.create_notification(
            user=notif_data['user'],
            notification_type=notif_data['type'],
            context=notif_data['context']
        )
        
        print(f"   Notification: {notif_data['type']} for {notif_data['user'].phone}")
        created_notifications.append(notification)
    
    return created_notifications

def main():
    """Main function to populate all test data"""
    print("🚀 Task 14 - Comprehensive Seed Data Setup")
    print("=" * 60)
    
    try:
        # Create all test data
        users = create_comprehensive_users()
        yachts = create_extended_yacht_fleet()
        ownerships = create_ownership_structures(users, yachts)
        fuel_wallets = create_fuel_wallets(users)
        bookings = create_diverse_bookings(users, yachts)
        payments = create_payment_history(bookings)
        inquiries = create_lead_sources_and_inquiries(users, yachts)
        notifications = create_notifications(users)
        
        print(f"\n{'='*60}")
        print("📊 Seed Data Summary:")
        print(f"👥 Users: {len(users)}")
        print(f"🛥️ Yachts: {len(yachts)}")
        print(f"🏠 Ownerships: {len(ownerships)}")
        print(f"⛽ Fuel Wallets: {len(fuel_wallets)}")
        print(f"📅 Bookings: {len(bookings)}")
        print(f"💳 Payments: {len(payments)}")
        print(f"🎯 Inquiries: {len(inquiries)}")
        print(f"🔔 Notifications: {len(notifications)}")
        
        print(f"\n🎉 Task 14 - Comprehensive seed data setup completed!")
        return True
        
    except Exception as e:
        print(f"❌ Error during seed data setup: {e}")
        return False

if __name__ == "__main__":
    main()