"""
URL configuration for boats app
Task 2 - Boats API (Public)
"""
from django.urls import path
from . import views_task2

app_name = 'boats'

urlpatterns = [
    # Task 2 - Boats API endpoints
    path('boats/', views_task2.list_boats, name='list-boats'),
    path('boats/<int:boat_id>/', views_task2.boat_detail, name='boat-detail'),
    path('boats/<int:boat_id>/availability/', views_task2.boat_availability, name='boat-availability'),
]