from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import connection
from .models import Yacht
from .serializers import YachtSerializer

class YachtViewSet(viewsets.ModelViewSet):
    queryset = Yacht.objects.all()
    serializer_class = YachtSerializer
    
    def list(self, request):
        """List all yachts"""
        try:
            # Get yachts directly from database to match Node.js API format
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, name, description, location, price_per_day,
                           capacity, cabins, length, year_built, images,
                           amenities, owner_id, is_active, rating, review_count,
                           created_at, updated_at
                    FROM yachts 
                    WHERE is_active = true 
                    ORDER BY created_at DESC
                """)
                
                columns = [col[0] for col in cursor.description]
                yachts = []
                
                for row in cursor.fetchall():
                    yacht_data = dict(zip(columns, row))
                    # Convert to frontend format
                    yacht = {
                        'id': yacht_data['id'],
                        'name': yacht_data['name'],
                        'description': yacht_data['description'],
                        'location': yacht_data['location'],
                        'pricePerDay': str(yacht_data['price_per_day']),
                        'capacity': yacht_data['capacity'],
                        'cabins': yacht_data['cabins'],
                        'length': str(yacht_data['length']),
                        'yearBuilt': yacht_data['year_built'],
                        'images': yacht_data['images'] or [],
                        'amenities': yacht_data['amenities'] or [],
                        'ownerId': yacht_data['owner_id'],
                        'isActive': yacht_data['is_active'],
                        'rating': str(yacht_data['rating']),
                        'reviewCount': yacht_data['review_count'],
                        'createdAt': yacht_data['created_at'].isoformat(),
                        'updatedAt': yacht_data['updated_at'].isoformat()
                    }
                    yachts.append(yacht)
                
                return Response(yachts)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch yachts: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def retrieve(self, request, pk=None):
        """Get single yacht by ID"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, name, description, location, price_per_day,
                           capacity, cabins, length, year_built, images,
                           amenities, owner_id, is_active, rating, review_count,
                           created_at, updated_at
                    FROM yachts 
                    WHERE id = %s
                """, [pk])
                
                row = cursor.fetchone()
                if not row:
                    return Response(
                        {'error': 'Yacht not found'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                columns = [col[0] for col in cursor.description]
                yacht_data = dict(zip(columns, row))
                
                yacht = {
                    'id': yacht_data['id'],
                    'name': yacht_data['name'],
                    'description': yacht_data['description'],
                    'location': yacht_data['location'],
                    'pricePerDay': str(yacht_data['price_per_day']),
                    'capacity': yacht_data['capacity'],
                    'cabins': yacht_data['cabins'],
                    'length': str(yacht_data['length']),
                    'yearBuilt': yacht_data['year_built'],
                    'images': yacht_data['images'] or [],
                    'amenities': yacht_data['amenities'] or [],
                    'ownerId': yacht_data['owner_id'],
                    'isActive': yacht_data['is_active'],
                    'rating': str(yacht_data['rating']),
                    'reviewCount': yacht_data['review_count'],
                    'createdAt': yacht_data['created_at'].isoformat(),
                    'updatedAt': yacht_data['updated_at'].isoformat()
                }
                
                return Response(yacht)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch yacht: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request):
        """Create new yacht"""
        try:
            data = request.data
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO yachts (name, description, location, price_per_day,
                                      capacity, cabins, length, year_built, images,
                                      amenities, is_active)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, created_at, updated_at
                """, [
                    data.get('name'),
                    data.get('description'),
                    data.get('location'),
                    float(data.get('pricePerDay', 0)),
                    int(data.get('capacity', 0)),
                    int(data.get('cabins', 0)),
                    float(data.get('length', 0)),
                    int(data.get('yearBuilt', 2024)),
                    data.get('images', []),
                    data.get('amenities', []),
                    True
                ])
                
                result = cursor.fetchone()
                yacht_id, created_at, updated_at = result
                
                # Return created yacht
                return Response({
                    'id': yacht_id,
                    'name': data.get('name'),
                    'description': data.get('description'),
                    'location': data.get('location'),
                    'pricePerDay': str(data.get('pricePerDay')),
                    'capacity': int(data.get('capacity')),
                    'cabins': int(data.get('cabins')),
                    'length': str(data.get('length')),
                    'yearBuilt': int(data.get('yearBuilt')),
                    'images': data.get('images', []),
                    'amenities': data.get('amenities', []),
                    'ownerId': None,
                    'isActive': True,
                    'rating': '0.00',
                    'reviewCount': 0,
                    'createdAt': created_at.isoformat(),
                    'updatedAt': updated_at.isoformat()
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to create yacht: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )