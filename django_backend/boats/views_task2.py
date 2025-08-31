"""
Task 2 - Boats API Views
Public API for listing boats/yachts
"""
import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Boat
import logging

logger = logging.getLogger(__name__)

@require_http_methods(["GET"])
def list_boats(request):
    """
    Task 2 - List boats & basic fields
    GET /boats/
    Returns: Array of boats with id,name,model,capacity,location,allow_public_rental
    """
    try:
        # Get all active boats that allow public rental
        boats = Boat.objects.filter(is_active=True, allow_public_rental=True)
        
        boats_data = []
        for boat in boats:
            boats_data.append({
                'id': boat.id,
                'name': boat.name,
                'model': boat.model,
                'capacity': boat.capacity,
                'location': boat.location,
                'allow_public_rental': boat.allow_public_rental,
                'daily_rate': str(boat.daily_rate),
                'length': str(boat.length),
                'description': boat.description,
                'image_url': boat.image_url,
            })
        
        logger.info(f"Boats API called, returned {len(boats_data)} boats")
        
        return JsonResponse(boats_data, safe=False)
        
    except Exception as e:
        logger.error(f"Error in boats API: {e}")
        return JsonResponse({
            'error': 'Failed to fetch boats'
        }, status=500)

@require_http_methods(["GET"])
def boat_detail(request, boat_id):
    """
    Get detailed information about a specific boat
    GET /boats/{id}/
    """
    try:
        boat = Boat.objects.get(id=boat_id, is_active=True)
        
        # Get boat features
        features = []
        for feature in boat.features.all():
            features.append({
                'name': feature.feature_name,
                'value': feature.feature_value
            })
        
        boat_data = {
            'id': boat.id,
            'name': boat.name,
            'model': boat.model,
            'capacity': boat.capacity,
            'location': boat.location,
            'allow_public_rental': boat.allow_public_rental,
            'daily_rate': str(boat.daily_rate),
            'length': str(boat.length),
            'beam': str(boat.beam) if boat.beam else None,
            'description': boat.description,
            'image_url': boat.image_url,
            'features': features,
            'created_at': boat.created_at.isoformat(),
            'updated_at': boat.updated_at.isoformat(),
        }
        
        return JsonResponse(boat_data)
        
    except Boat.DoesNotExist:
        return JsonResponse({
            'error': 'Boat not found'
        }, status=404)
    except Exception as e:
        logger.error(f"Error fetching boat {boat_id}: {e}")
        return JsonResponse({
            'error': 'Failed to fetch boat details'
        }, status=500)