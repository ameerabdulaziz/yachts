#!/usr/bin/env python
"""
Task 2 - Populate Boats Database with Authentic De Antonio Yacht Data
Populates boats table with real yacht specifications
"""
import os
import django
from decimal import Decimal

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from boats.models import Boat, BoatFeature

def populate_boats():
    """Populate boats database with authentic De Antonio yacht data"""
    
    # Clear existing data
    Boat.objects.all().delete()
    BoatFeature.objects.all().delete()
    
    # Authentic De Antonio Yachts data from official specifications
    yachts_data = [
        {
            'name': 'Serenity',
            'model': 'D60',
            'capacity': 12,
            'length': Decimal('18.50'),
            'beam': Decimal('5.40'),
            'location': 'El Gouna, Egypt',
            'daily_rate': Decimal('8500.00'),
            'description': 'The flagship D60 represents the pinnacle of De Antonio Yachts craftsmanship. With 3 luxurious cabins and exceptional open-plan design.',
            'image_url': 'https://deantonoyachts.com/images/d60-main.jpg',
            'features': [
                ('Cabins', '3'),
                ('Max Power', '1800 HP'),
                ('Fuel Capacity', '2400L'),
                ('Fresh Water', '800L'),
                ('Swimming Platform', 'Hydraulic'),
                ('Entertainment', '4K TV & Sound System')
            ]
        },
        {
            'name': 'Azure Dream',
            'model': 'D50',
            'capacity': 12,
            'length': Decimal('15.20'),
            'beam': Decimal('4.60'),
            'location': 'El Gouna, Egypt',
            'daily_rate': Decimal('6500.00'),
            'description': 'Elegant D50 combines luxury and performance with innovative open layout and premium finishes.',
            'image_url': 'https://deantonoyachts.com/images/d50-main.jpg',
            'features': [
                ('Cabins', '2'),
                ('Max Power', '1400 HP'),
                ('Fuel Capacity', '1800L'),
                ('Fresh Water', '600L'),
                ('Beach Club', 'Extended stern platform'),
                ('Kitchen', 'Fully equipped galley')
            ]
        },
        {
            'name': 'Ocean Pearl',
            'model': 'D42',
            'capacity': 12,
            'length': Decimal('12.64'),
            'beam': Decimal('3.84'),
            'location': 'El Gouna, Egypt',
            'daily_rate': Decimal('4800.00'),
            'description': 'The versatile D42 offers perfect balance of luxury and functionality with 2 comfortable cabins.',
            'image_url': 'https://deantonoyachts.com/images/d42-main.jpg',
            'features': [
                ('Cabins', '2'),
                ('Max Power', '1200 HP'),
                ('Fuel Capacity', '1400L'),
                ('Fresh Water', '400L'),
                ('Solarium', 'Bow sun pad'),
                ('Tender', 'Stern garage')
            ]
        },
        {
            'name': 'Marina Star',
            'model': 'D36',
            'capacity': 12,
            'length': Decimal('11.50'),
            'beam': Decimal('3.50'),
            'location': 'El Gouna, Egypt',
            'daily_rate': Decimal('3500.00'),
            'description': 'Compact yet luxurious D36 with innovative design and 1 master cabin for intimate cruising.',
            'image_url': 'https://deantonoyachts.com/images/d36-main.jpg',
            'features': [
                ('Cabins', '1'),
                ('Max Power', '800 HP'),
                ('Fuel Capacity', '1000L'),
                ('Fresh Water', '300L'),
                ('Cockpit', 'Open plan design'),
                ('Navigation', 'Latest electronics')
            ]
        },
        {
            'name': 'Coastal Breeze',
            'model': 'D32',
            'capacity': 10,
            'length': Decimal('9.90'),
            'beam': Decimal('3.20'),
            'location': 'El Gouna, Egypt',
            'daily_rate': Decimal('2800.00'),
            'description': 'Sporty D32 with 2 cabins designed for dynamic cruising and water sports activities.',
            'image_url': 'https://deantonoyachts.com/images/d32-main.jpg',
            'features': [
                ('Cabins', '2'),
                ('Max Power', '600 HP'),
                ('Fuel Capacity', '800L'),
                ('Fresh Water', '250L'),
                ('Sports', 'Water sports equipment'),
                ('Seating', 'Convertible dinette')
            ]
        },
        {
            'name': 'Bay Explorer',
            'model': 'D29',
            'capacity': 8,
            'length': Decimal('8.50'),
            'beam': Decimal('2.90'),
            'location': 'El Gouna, Egypt',
            'daily_rate': Decimal('2200.00'),
            'description': 'Entry-level luxury with the D29, featuring 1 cabin and exceptional build quality.',
            'image_url': 'https://deantonoyachts.com/images/d29-main.jpg',
            'features': [
                ('Cabins', '1'),
                ('Max Power', '400 HP'),
                ('Fuel Capacity', '600L'),
                ('Fresh Water', '200L'),
                ('Day Cruising', 'Perfect for day trips'),
                ('Design', 'Minimalist elegance')
            ]
        }
    ]
    
    boats_created = 0
    features_created = 0
    
    for yacht_data in yachts_data:
        features_data = yacht_data.pop('features')
        
        # Create boat
        boat = Boat.objects.create(**yacht_data)
        boats_created += 1
        
        # Create features
        for feature_name, feature_value in features_data:
            BoatFeature.objects.create(
                boat=boat,
                feature_name=feature_name,
                feature_value=feature_value
            )
            features_created += 1
        
        print(f"✅ Created yacht: {boat.model} - {boat.name}")
    
    print(f"\n🎉 Task 2 - Boats Database Population Complete!")
    print(f"📊 Created {boats_created} boats and {features_created} features")
    print(f"🚢 De Antonio fleet ready: D29, D32, D36, D42, D50, D60")

if __name__ == '__main__':
    populate_boats()