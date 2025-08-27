"""
Yacht API views for Nauttec platform
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Yacht, YachtAvailability
from .serializers import YachtListSerializer, YachtDetailSerializer, YachtAvailabilitySerializer

class YachtViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Yacht discovery and details API
    Supports filtering by model, location, capacity, price range
    """
    queryset = Yacht.objects.filter(is_active=True)
    permission_classes = [AllowAny]  # Public yacht browsing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['model', 'location', 'status']
    search_fields = ['name', 'description', 'amenities']
    ordering_fields = ['price_per_day', 'rating', 'length', 'capacity']
    ordering = ['model', 'name']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return YachtDetailSerializer
        return YachtListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by capacity
        min_capacity = self.request.query_params.get('min_capacity')
        max_capacity = self.request.query_params.get('max_capacity')
        if min_capacity:
            queryset = queryset.filter(capacity__gte=min_capacity)
        if max_capacity:
            queryset = queryset.filter(capacity__lte=max_capacity)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price_per_day__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_day__lte=max_price)
        
        # Filter by yacht length
        min_length = self.request.query_params.get('min_length')
        max_length = self.request.query_params.get('max_length')
        if min_length:
            queryset = queryset.filter(length__gte=min_length)
        if max_length:
            queryset = queryset.filter(length__lte=max_length)
        
        # Filter available for specific dates
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            # Exclude yachts with bookings or unavailable dates in the range
            unavailable_yachts = YachtAvailability.objects.filter(
                date__range=[start_date, end_date],
                is_available=False
            ).values_list('yacht_id', flat=True)
            queryset = queryset.exclude(id__in=unavailable_yachts)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Get yacht availability calendar"""
        yacht = self.get_object()
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        
        availability_qs = yacht.availability.all()
        if month and year:
            availability_qs = availability_qs.filter(date__month=month, date__year=year)
        
        serializer = YachtAvailabilitySerializer(availability_qs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def pricing(self, request, pk=None):
        """Get dynamic pricing for date range"""
        yacht = self.get_object()
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date parameters required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from datetime import datetime
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()
            
            total_days = (end - start).days
            base_price = yacht.get_current_price(start)
            total_price = base_price * total_days
            
            return Response({
                'base_price_per_day': base_price,
                'total_days': total_days,
                'total_price': total_price,
                'seasonal_multiplier': yacht.seasonal_multiplier,
            })
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured yachts for homepage"""
        featured_yachts = self.queryset.filter(
            rating__gte=4.0,
            is_active=True
        ).order_by('-rating', '-review_count')[:6]
        
        serializer = self.get_serializer(featured_yachts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def models(self, request):
        """Get available yacht models with counts"""
        from django.db.models import Count
        models = Yacht.objects.filter(is_active=True).values('model').annotate(
            count=Count('id')
        ).order_by('model')
        
        return Response(models)