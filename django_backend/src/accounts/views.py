from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import connection
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def list(self, request):
        """List all users"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, phone, email, first_name, last_name,
                           profile_image_url, role, is_verified, fuel_wallet_balance,
                           created_at, updated_at
                    FROM users 
                    ORDER BY created_at DESC
                """)
                
                columns = [col[0] for col in cursor.description]
                users = []
                
                for row in cursor.fetchall():
                    user_data = dict(zip(columns, row))
                    user = {
                        'id': user_data['id'],
                        'phone': user_data['phone'],
                        'email': user_data['email'],
                        'firstName': user_data['first_name'],
                        'lastName': user_data['last_name'],
                        'profileImageUrl': user_data['profile_image_url'],
                        'role': user_data['role'],
                        'isVerified': user_data['is_verified'],
                        'fuelWalletBalance': str(user_data['fuel_wallet_balance']),
                        'createdAt': user_data['created_at'].isoformat() if user_data['created_at'] else None,
                        'updatedAt': user_data['updated_at'].isoformat() if user_data['updated_at'] else None
                    }
                    users.append(user)
                
                return Response(users)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch users: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request):
        """Create new user"""
        try:
            data = request.data
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO users (phone, email, first_name, last_name, role, 
                                     fuel_wallet_balance, is_verified)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, created_at, updated_at
                """, [
                    data.get('phone'),
                    data.get('email'),
                    data.get('firstName'),
                    data.get('lastName'),
                    data.get('role', 'renter'),
                    float(data.get('fuelWalletBalance', 0)),
                    data.get('isVerified', False)
                ])
                
                result = cursor.fetchone()
                user_id, created_at, updated_at = result
                
                return Response({
                    'id': user_id,
                    'phone': data.get('phone'),
                    'email': data.get('email'),
                    'firstName': data.get('firstName'),
                    'lastName': data.get('lastName'),
                    'profileImageUrl': None,
                    'role': data.get('role', 'renter'),
                    'isVerified': data.get('isVerified', False),
                    'fuelWalletBalance': str(data.get('fuelWalletBalance', '0.00')),
                    'createdAt': created_at.isoformat(),
                    'updatedAt': updated_at.isoformat()
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to create user: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )