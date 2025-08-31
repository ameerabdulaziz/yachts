"""
URL configuration for bookings app
Task 3 & 4 - Calendar and Owner Booking endpoints
"""
from django.urls import path
from . import views_task3, views_task4, views_task5

app_name = 'bookings'

urlpatterns = [
    # Task 3 - Owner Calendar (Read) endpoints
    path('boats/<int:boat_id>/calendar/', views_task3.boat_calendar, name='boat-calendar'),
    path('bookings/', views_task3.user_bookings, name='user-bookings'),
    
    # Task 4 - Owner Booking (Write + Rules v1) endpoints
    path('bookings/owner/', views_task4.create_owner_booking, name='create-owner-booking'),
    path('boats/<int:boat_id>/booking-rules/', views_task4.check_booking_rules, name='check-booking-rules'),
    
    # Task 5 - Visitor Rental Booking endpoints
    path('bookings/rental/', views_task5.create_visitor_rental, name='create-visitor-rental'),
    path('boats/<int:boat_id>/rental-quote/', views_task5.get_rental_quote, name='get-rental-quote'),
]