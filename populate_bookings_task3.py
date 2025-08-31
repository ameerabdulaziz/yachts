#!/usr/bin/env python
"""
Task 3 - Populate Bookings and Calendar Data
Creates sample bookings and calendar events for testing
"""
import os
import django
from datetime import datetime, date, time, timedelta
from decimal import Decimal

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.contrib.auth import get_user_model
from boats.models import Boat
from bookings.models import Booking, CalendarEvent

User = get_user_model()

def populate_calendar():
    """Populate bookings and calendar events for testing Task 3"""
    
    # Clear existing data
    Booking.objects.all().delete()
    CalendarEvent.objects.all().delete()
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        phone='+201234567890',
        defaults={
            'is_phone_verified': True,
            'email': 'demo@nauttec.com'
        }
    )
    
    # Get boats
    boats = list(Boat.objects.all()[:3])  # Use first 3 boats
    
    if not boats:
        print("❌ No boats found. Please run populate_boats_task2.py first")
        return
    
    # Sample bookings data
    today = date.today()
    bookings_data = [
        {
            'boat': boats[0],  # D60 Serenity
            'user': user,
            'booking_type': 'owner',
            'status': 'confirmed',
            'start_date': today + timedelta(days=5),
            'end_date': today + timedelta(days=7),
            'start_time': time(9, 0),
            'end_time': time(18, 0),
            'guest_count': 8,
            'total_amount': Decimal('17000.00'),
            'notes': 'Anniversary celebration - 3 day cruise'
        },
        {
            'boat': boats[1],  # D50 Azure Dream
            'user': user,
            'booking_type': 'rental',
            'status': 'confirmed',
            'start_date': today + timedelta(days=10),
            'end_date': today + timedelta(days=10),
            'start_time': time(10, 0),
            'end_time': time(16, 0),
            'guest_count': 6,
            'total_amount': Decimal('6500.00'),
            'notes': 'Day trip for family vacation'
        },
        {
            'boat': boats[0],  # D60 Serenity
            'user': user,
            'booking_type': 'owner',
            'status': 'pending',
            'start_date': today + timedelta(days=15),
            'end_date': today + timedelta(days=16),
            'start_time': time(8, 0),
            'end_time': time(20, 0),
            'guest_count': 12,
            'total_amount': Decimal('17000.00'),
            'notes': 'Corporate event - pending approval'
        },
        {
            'boat': boats[2],  # D42 Ocean Pearl
            'user': user,
            'booking_type': 'rental',
            'status': 'completed',
            'start_date': today - timedelta(days=5),
            'end_date': today - timedelta(days=4),
            'start_time': time(9, 0),
            'end_time': time(17, 0),
            'guest_count': 4,
            'total_amount': Decimal('9600.00'),
            'notes': 'Completed romantic getaway'
        }
    ]
    
    # Sample calendar events
    calendar_events_data = [
        {
            'boat': boats[0],
            'event_type': 'maintenance',
            'title': 'Scheduled Maintenance',
            'description': 'Engine service and hull cleaning',
            'start_date': today + timedelta(days=20),
            'end_date': today + timedelta(days=21),
            'start_time': time(8, 0),
            'end_time': time(17, 0),
        },
        {
            'boat': boats[1],
            'event_type': 'blocked',
            'title': 'Weather Hold',
            'description': 'High winds - boat blocked for safety',
            'start_date': today + timedelta(days=12),
            'end_date': today + timedelta(days=13),
        },
        {
            'boat': boats[2],
            'event_type': 'maintenance',
            'title': 'Annual Survey',
            'description': 'Annual hull and safety inspection',
            'start_date': today + timedelta(days=25),
            'end_date': today + timedelta(days=26),
            'start_time': time(9, 0),
            'end_time': time(15, 0),
        }
    ]
    
    # Create bookings
    bookings_created = 0
    for booking_data in bookings_data:
        booking = Booking.objects.create(**booking_data)
        bookings_created += 1
        print(f"✅ Created booking: {booking.boat.model} - {booking.status} ({booking.start_date})")
    
    # Create calendar events
    events_created = 0
    for event_data in calendar_events_data:
        event = CalendarEvent.objects.create(**event_data)
        events_created += 1
        print(f"✅ Created event: {event.boat.model} - {event.title} ({event.start_date})")
    
    print(f"\n🎉 Task 3 - Calendar Population Complete!")
    print(f"📅 Created {bookings_created} bookings and {events_created} calendar events")
    print(f"👤 Test user: {user.phone}")
    print(f"🚢 Calendar data available for boats: {', '.join([b.model for b in boats])}")

if __name__ == '__main__':
    populate_calendar()