"""
Task 12 - Inquiries (Lead Capture) Views
API endpoints for lead capture and management
"""
import json
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.db.models import Q, Count, Avg
from decimal import Decimal
from .models import Inquiry, InquiryFollowUp, LeadSource
from boats.models import Boat
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def create_inquiry(request):
    """
    Task 12 - Create new inquiry/lead
    POST /inquiries/
    Body: {
        "first_name": "John",
        "last_name": "Doe", 
        "email": "john@example.com",
        "phone": "+1234567890",
        "inquiry_type": "fractional",
        "boat_id": 1,
        "message": "Interested in fractional ownership",
        "budget_range_min": 100000,
        "budget_range_max": 250000,
        "timeline": "3-6 months",
        "source": "website",
        "consent_marketing": true
    }
    """
    try:
        data = json.loads(request.body)
        
        # Extract required fields
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        email = data.get('email', '').strip()
        inquiry_type = data.get('inquiry_type', 'general')
        message = data.get('message', '').strip()
        
        # Validate required fields
        if not all([first_name, last_name, email, message]):
            return JsonResponse({
                'success': False,
                'message': 'first_name, last_name, email, and message are required'
            }, status=400)
        
        # Validate email format (basic check)
        if '@' not in email or '.' not in email:
            return JsonResponse({
                'success': False,
                'message': 'Invalid email address format'
            }, status=400)
        
        # Get optional boat reference
        boat = None
        boat_id = data.get('boat_id')
        if boat_id:
            try:
                boat = Boat.objects.get(id=boat_id, is_active=True)
            except Boat.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid boat ID'
                }, status=400)
        
        # Calculate initial lead score based on available information
        lead_score = calculate_lead_score(data)
        
        # Create the inquiry
        inquiry = Inquiry.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=data.get('phone', '').strip(),
            company=data.get('company', '').strip(),
            inquiry_type=inquiry_type,
            boat=boat,
            message=message,
            budget_range_min=Decimal(str(data['budget_range_min'])) if data.get('budget_range_min') else None,
            budget_range_max=Decimal(str(data['budget_range_max'])) if data.get('budget_range_max') else None,
            timeline=data.get('timeline', '').strip(),
            preferred_location=data.get('preferred_location', '').strip(),
            source=data.get('source', 'website'),
            lead_score=lead_score,
            is_qualified=lead_score >= 60,  # Auto-qualify high-score leads
            consent_marketing=data.get('consent_marketing', False),
            consent_data_processing=data.get('consent_data_processing', True),
        )
        
        # Update lead source tracking
        source_name = data.get('source', 'website')
        lead_source, created = LeadSource.objects.get_or_create(
            name=source_name,
            defaults={
                'description': f'Leads from {source_name}',
                'is_active': True,
            }
        )
        lead_source.total_leads += 1
        if inquiry.is_qualified:
            lead_source.qualified_leads += 1
        lead_source.save()
        
        logger.info(f"New inquiry created: {inquiry.id} from {inquiry.email} ({inquiry.inquiry_type})")
        
        return JsonResponse({
            'success': True,
            'inquiry': {
                'id': inquiry.id,
                'full_name': inquiry.full_name,
                'email': inquiry.email,
                'phone': inquiry.phone,
                'company': inquiry.company,
                'inquiry_type': inquiry.inquiry_type,
                'boat': {
                    'id': boat.id,
                    'name': boat.name,
                    'model': boat.model,
                } if boat else None,
                'status': inquiry.status,
                'priority': inquiry.priority,
                'source': inquiry.source,
                'budget_display': inquiry.budget_display,
                'timeline': inquiry.timeline,
                'lead_score': inquiry.lead_score,
                'is_qualified': inquiry.is_qualified,
                'created_at': inquiry.created_at.isoformat(),
            },
            'message': f'Inquiry submitted successfully. Lead score: {lead_score}/100',
            'next_steps': get_next_steps_message(inquiry)
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON'
        }, status=400)
    except Exception as e:
        logger.error(f"Error creating inquiry: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to create inquiry'
        }, status=500)

@require_http_methods(["GET"])
def list_inquiries(request):
    """
    List inquiries with filtering and sorting
    GET /inquiries/?status=new&inquiry_type=fractional&limit=20
    """
    try:
        # Get query parameters
        status = request.GET.get('status')
        inquiry_type = request.GET.get('inquiry_type')
        priority = request.GET.get('priority')
        source = request.GET.get('source')
        qualified_only = request.GET.get('qualified_only') == 'true'
        limit = int(request.GET.get('limit', 50))
        
        # Build query
        inquiries_query = Inquiry.objects.all()
        
        if status:
            inquiries_query = inquiries_query.filter(status=status)
        if inquiry_type:
            inquiries_query = inquiries_query.filter(inquiry_type=inquiry_type)
        if priority:
            inquiries_query = inquiries_query.filter(priority=priority)
        if source:
            inquiries_query = inquiries_query.filter(source=source)
        if qualified_only:
            inquiries_query = inquiries_query.filter(is_qualified=True)
        
        # Apply limit and get data
        inquiries = inquiries_query.order_by('-created_at')[:limit]
        
        inquiries_data = []
        for inquiry in inquiries:
            inquiries_data.append({
                'id': inquiry.id,
                'full_name': inquiry.full_name,
                'email': inquiry.email,
                'phone': inquiry.phone,
                'company': inquiry.company,
                'inquiry_type': inquiry.inquiry_type,
                'boat': {
                    'id': inquiry.boat.id,
                    'name': inquiry.boat.name,
                    'model': inquiry.boat.model,
                } if inquiry.boat else None,
                'status': inquiry.status,
                'priority': inquiry.priority,
                'source': inquiry.source,
                'budget_display': inquiry.budget_display,
                'timeline': inquiry.timeline,
                'lead_score': inquiry.lead_score,
                'is_qualified': inquiry.is_qualified,
                'last_contact_date': inquiry.last_contact_date.isoformat() if inquiry.last_contact_date else None,
                'next_follow_up_date': inquiry.next_follow_up_date.isoformat() if inquiry.next_follow_up_date else None,
                'created_at': inquiry.created_at.isoformat(),
            })
        
        # Get summary statistics
        stats = {
            'total_inquiries': inquiries_query.count(),
            'qualified_leads': inquiries_query.filter(is_qualified=True).count(),
            'new_leads': inquiries_query.filter(status='new').count(),
            'active_leads': inquiries_query.filter(status__in=['contacted', 'qualified', 'negotiating']).count(),
        }
        
        return JsonResponse({
            'success': True,
            'inquiries': inquiries_data,
            'count': len(inquiries_data),
            'statistics': stats,
            'filters_applied': {
                'status': status,
                'inquiry_type': inquiry_type,
                'priority': priority,
                'source': source,
                'qualified_only': qualified_only,
            }
        })
        
    except ValueError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid limit parameter'
        }, status=400)
    except Exception as e:
        logger.error(f"Error listing inquiries: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to list inquiries'
        }, status=500)

@require_http_methods(["GET"])
def get_inquiry_details(request, inquiry_id):
    """
    Get detailed inquiry information including follow-up history
    GET /inquiries/{id}/
    """
    try:
        inquiry = Inquiry.objects.get(id=inquiry_id)
        
        # Get follow-up history
        follow_ups = InquiryFollowUp.objects.filter(inquiry=inquiry).order_by('-created_at')
        follow_ups_data = []
        
        for follow_up in follow_ups:
            follow_ups_data.append({
                'id': follow_up.id,
                'activity_type': follow_up.activity_type,
                'outcome': follow_up.outcome,
                'subject': follow_up.subject,
                'description': follow_up.description,
                'duration_minutes': follow_up.duration_minutes,
                'contacted_by': follow_up.contacted_by.phone if follow_up.contacted_by else None,
                'scheduled_date': follow_up.scheduled_date.isoformat() if follow_up.scheduled_date else None,
                'completed_date': follow_up.completed_date.isoformat() if follow_up.completed_date else None,
                'next_action_date': follow_up.next_action_date.isoformat() if follow_up.next_action_date else None,
                'next_action_notes': follow_up.next_action_notes,
                'created_at': follow_up.created_at.isoformat(),
            })
        
        return JsonResponse({
            'success': True,
            'inquiry': {
                'id': inquiry.id,
                'full_name': inquiry.full_name,
                'email': inquiry.email,
                'phone': inquiry.phone,
                'company': inquiry.company,
                'inquiry_type': inquiry.inquiry_type,
                'boat': {
                    'id': inquiry.boat.id,
                    'name': inquiry.boat.name,
                    'model': inquiry.boat.model,
                    'location': inquiry.boat.location,
                    'daily_rate': str(inquiry.boat.daily_rate),
                } if inquiry.boat else None,
                'status': inquiry.status,
                'priority': inquiry.priority,
                'source': inquiry.source,
                'budget_range_min': str(inquiry.budget_range_min) if inquiry.budget_range_min else None,
                'budget_range_max': str(inquiry.budget_range_max) if inquiry.budget_range_max else None,
                'budget_display': inquiry.budget_display,
                'timeline': inquiry.timeline,
                'preferred_location': inquiry.preferred_location,
                'message': inquiry.message,
                'internal_notes': inquiry.internal_notes,
                'lead_score': inquiry.lead_score,
                'is_qualified': inquiry.is_qualified,
                'consent_marketing': inquiry.consent_marketing,
                'consent_data_processing': inquiry.consent_data_processing,
                'assigned_to': inquiry.assigned_to.phone if inquiry.assigned_to else None,
                'last_contact_date': inquiry.last_contact_date.isoformat() if inquiry.last_contact_date else None,
                'next_follow_up_date': inquiry.next_follow_up_date.isoformat() if inquiry.next_follow_up_date else None,
                'created_at': inquiry.created_at.isoformat(),
                'updated_at': inquiry.updated_at.isoformat(),
            },
            'follow_ups': follow_ups_data,
            'follow_up_count': len(follow_ups_data),
        })
        
    except Inquiry.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Inquiry not found'
        }, status=404)
    except Exception as e:
        logger.error(f"Error getting inquiry details: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Failed to get inquiry details'
        }, status=500)

def calculate_lead_score(data):
    """
    Calculate lead score based on available information - Task 12
    Scoring algorithm for lead qualification
    """
    score = 0
    
    # Budget scoring (0-25 points)
    budget_min = data.get('budget_range_min')
    budget_max = data.get('budget_range_max')
    if budget_min:
        budget_min = float(budget_min)
        if budget_min >= 500000:  # High-value lead
            score += 25
        elif budget_min >= 200000:  # Medium-high value
            score += 20
        elif budget_min >= 100000:  # Medium value
            score += 15
        elif budget_min >= 50000:   # Low-medium value
            score += 10
        else:                       # Low value
            score += 5
    
    # Timeline urgency (0-20 points)
    timeline = data.get('timeline', '').lower()
    if 'immediate' in timeline or 'asap' in timeline:
        score += 20
    elif '1 month' in timeline or 'within month' in timeline:
        score += 18
    elif '3 months' in timeline or '2-3' in timeline:
        score += 15
    elif '6 months' in timeline or '3-6' in timeline:
        score += 12
    elif 'year' in timeline:
        score += 8
    
    # Inquiry type value (0-15 points)
    inquiry_type = data.get('inquiry_type', 'general')
    if inquiry_type == 'purchase':
        score += 15
    elif inquiry_type == 'fractional':
        score += 12
    elif inquiry_type == 'charter':
        score += 10
    elif inquiry_type == 'rental':
        score += 8
    else:  # general
        score += 5
    
    # Contact completeness (0-15 points)
    contact_score = 0
    if data.get('phone'):
        contact_score += 5
    if data.get('company'):
        contact_score += 3
    if data.get('email') and '@' in data['email']:
        contact_score += 7
    score += contact_score
    
    # Message quality (0-10 points)
    message = data.get('message', '')
    if len(message) > 100:
        score += 10
    elif len(message) > 50:
        score += 7
    elif len(message) > 20:
        score += 5
    else:
        score += 2
    
    # Source quality (0-15 points)
    source = data.get('source', 'website')
    if source == 'referral':
        score += 15
    elif source == 'boat_show':
        score += 12
    elif source == 'phone':
        score += 10
    elif source == 'website':
        score += 8
    elif source == 'email':
        score += 6
    else:
        score += 3
    
    return min(100, score)  # Cap at 100

def get_next_steps_message(inquiry):
    """Get personalized next steps message based on inquiry"""
    if inquiry.lead_score >= 80:
        return "High-priority lead! Sales team will contact you within 2 business hours."
    elif inquiry.lead_score >= 60:
        return "Qualified lead. You'll receive detailed information within 24 hours."
    elif inquiry.inquiry_type == 'general':
        return "Thank you for your interest. We'll send you our yacht catalog shortly."
    else:
        return "Thank you for your inquiry. Our team will review and respond within 48 hours."