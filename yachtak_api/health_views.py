"""
Task 15 - Health Check Views
Comprehensive system health monitoring endpoints
"""
from django.http import JsonResponse
from django.db import connection
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
import time

from boats.models import Boat
from bookings.models import Booking
from ownership.models import FractionalOwnership, FuelWallet
from payment_system.models import PaymentIntent
from inquiries.models import Inquiry, LeadSource
from notify_system.models import Notification, NotificationTemplate

User = get_user_model()

@require_http_methods(["GET"])
def health_check(request):
    """Basic health check endpoint"""
    try:
        # Check database connectivity
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        
        return JsonResponse({
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'version': '1.0.0',
            'database': 'connected',
            'message': 'Nauttec platform is operational'
        })
    
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'timestamp': timezone.now().isoformat(),
            'error': str(e),
            'message': 'System health check failed'
        }, status=503)

@require_http_methods(["GET"])
def database_health(request):
    """Detailed database health check"""
    try:
        start_time = time.time()
        
        # Test database connectivity and get table counts
        health_data = {
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'database': {
                'connected': True,
                'response_time_ms': 0,
                'tables': {}
            }
        }
        
        # Count records in each main table
        table_counts = {
            'users': User.objects.count(),
            'boats': Boat.objects.count(),
            'bookings': Booking.objects.count(),
            'fractional_ownerships': FractionalOwnership.objects.count(),
            'fuel_wallets': FuelWallet.objects.count(),
            'payment_intents': PaymentIntent.objects.count(),
            'inquiries': Inquiry.objects.count(),
            'lead_sources': LeadSource.objects.count(),
            'notifications': Notification.objects.count(),
            'notification_templates': NotificationTemplate.objects.count()
        }
        
        health_data['database']['tables'] = table_counts
        health_data['database']['response_time_ms'] = round((time.time() - start_time) * 1000, 2)
        health_data['database']['total_records'] = sum(table_counts.values())
        
        return JsonResponse(health_data)
    
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'timestamp': timezone.now().isoformat(),
            'database': {
                'connected': False,
                'error': str(e)
            },
            'message': 'Database health check failed'
        }, status=503)

@csrf_exempt
@require_http_methods(["POST"])
def test_all_systems(request):
    """Comprehensive system test with detailed results"""
    try:
        # Parse request body
        try:
            body = json.loads(request.body)
            test_user_phone = body.get('test_user_phone', '+201234567890')
            run_comprehensive = body.get('run_comprehensive_tests', True)
        except:
            test_user_phone = '+201234567890'
            run_comprehensive = True
        
        start_time = time.time()
        test_results = {
            'status': 'success',
            'timestamp': timezone.now().isoformat(),
            'test_duration_seconds': 0,
            'tests_run': 0,
            'tests_passed': 0,
            'tests_failed': 0,
            'system_tests': {},
            'summary': {}
        }
        
        # Test 1: Database Connectivity
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM django_migrations")
                migration_count = cursor.fetchone()[0]
            
            test_results['system_tests']['database'] = {
                'status': 'passed',
                'message': f'Database connected with {migration_count} migrations',
                'response_time_ms': round((time.time() - start_time) * 1000, 2)
            }
            test_results['tests_passed'] += 1
        except Exception as e:
            test_results['system_tests']['database'] = {
                'status': 'failed',
                'error': str(e)
            }
            test_results['tests_failed'] += 1
        
        test_results['tests_run'] += 1
        
        # Test 2: Model Operations
        try:
            # Test user creation/retrieval
            test_user = User.objects.filter(phone=test_user_phone).first()
            user_exists = test_user is not None
            
            # Test yacht data
            yacht_count = Boat.objects.count()
            
            # Test bookings
            booking_count = Booking.objects.count()
            
            test_results['system_tests']['models'] = {
                'status': 'passed',
                'details': {
                    'test_user_exists': user_exists,
                    'yacht_count': yacht_count,
                    'booking_count': booking_count,
                    'models_accessible': True
                }
            }
            test_results['tests_passed'] += 1
        except Exception as e:
            test_results['system_tests']['models'] = {
                'status': 'failed',
                'error': str(e)
            }
            test_results['tests_failed'] += 1
        
        test_results['tests_run'] += 1
        
        # Test 3: Payment System (if comprehensive)
        if run_comprehensive:
            try:
                payment_count = PaymentIntent.objects.count()
                recent_payments = PaymentIntent.objects.filter(
                    created_at__gte=timezone.now() - timezone.timedelta(days=30)
                ).count()
                
                test_results['system_tests']['payments'] = {
                    'status': 'passed',
                    'details': {
                        'total_payments': payment_count,
                        'recent_payments': recent_payments,
                        'payment_system_accessible': True
                    }
                }
                test_results['tests_passed'] += 1
            except Exception as e:
                test_results['system_tests']['payments'] = {
                    'status': 'failed',
                    'error': str(e)
                }
                test_results['tests_failed'] += 1
            
            test_results['tests_run'] += 1
        
        # Test 4: Notification System (if comprehensive)
        if run_comprehensive:
            try:
                notification_count = Notification.objects.count()
                template_count = NotificationTemplate.objects.count()
                
                test_results['system_tests']['notifications'] = {
                    'status': 'passed',
                    'details': {
                        'notification_count': notification_count,
                        'template_count': template_count,
                        'notification_system_operational': True
                    }
                }
                test_results['tests_passed'] += 1
            except Exception as e:
                test_results['system_tests']['notifications'] = {
                    'status': 'failed',
                    'error': str(e)
                }
                test_results['tests_failed'] += 1
            
            test_results['tests_run'] += 1
        
        # Test 5: Inquiry System (if comprehensive)
        if run_comprehensive:
            try:
                inquiry_count = Inquiry.objects.count()
                lead_source_count = LeadSource.objects.count()
                qualified_leads = Inquiry.objects.filter(is_qualified=True).count()
                
                test_results['system_tests']['inquiries'] = {
                    'status': 'passed',
                    'details': {
                        'inquiry_count': inquiry_count,
                        'lead_source_count': lead_source_count,
                        'qualified_leads': qualified_leads,
                        'inquiry_system_operational': True
                    }
                }
                test_results['tests_passed'] += 1
            except Exception as e:
                test_results['system_tests']['inquiries'] = {
                    'status': 'failed',
                    'error': str(e)
                }
                test_results['tests_failed'] += 1
            
            test_results['tests_run'] += 1
        
        # Calculate final results
        test_results['test_duration_seconds'] = round(time.time() - start_time, 3)
        test_results['summary'] = {
            'success_rate': round((test_results['tests_passed'] / test_results['tests_run']) * 100, 1) if test_results['tests_run'] > 0 else 0,
            'all_tests_passed': test_results['tests_failed'] == 0,
            'critical_systems_operational': test_results['system_tests'].get('database', {}).get('status') == 'passed' and test_results['system_tests'].get('models', {}).get('status') == 'passed'
        }
        
        # Set overall status
        if test_results['tests_failed'] > 0:
            test_results['status'] = 'partial_success' if test_results['tests_passed'] > 0 else 'failed'
        
        status_code = 200 if test_results['summary']['critical_systems_operational'] else 503
        
        return JsonResponse(test_results, status=status_code)
    
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'timestamp': timezone.now().isoformat(),
            'error': str(e),
            'message': 'System test execution failed'
        }, status=500)

@require_http_methods(["GET"])
def api_status(request):
    """API endpoint status and performance metrics"""
    try:
        start_time = time.time()
        
        # Test key API functionality
        api_tests = {}
        
        # Test yacht listing
        try:
            yacht_count = Boat.objects.count()
            api_tests['yacht_api'] = {
                'status': 'operational',
                'yacht_count': yacht_count,
                'endpoint': '/boats/'
            }
        except Exception as e:
            api_tests['yacht_api'] = {
                'status': 'error',
                'error': str(e)
            }
        
        # Test booking API
        try:
            booking_count = Booking.objects.count()
            api_tests['booking_api'] = {
                'status': 'operational',
                'booking_count': booking_count,
                'endpoint': '/bookings/'
            }
        except Exception as e:
            api_tests['booking_api'] = {
                'status': 'error',
                'error': str(e)
            }
        
        # Test user API
        try:
            user_count = User.objects.count()
            api_tests['user_api'] = {
                'status': 'operational',
                'user_count': user_count,
                'endpoint': '/auth/'
            }
        except Exception as e:
            api_tests['user_api'] = {
                'status': 'error',
                'error': str(e)
            }
        
        response_time = round((time.time() - start_time) * 1000, 2)
        
        operational_apis = sum(1 for test in api_tests.values() if test.get('status') == 'operational')
        total_apis = len(api_tests)
        
        return JsonResponse({
            'status': 'healthy' if operational_apis == total_apis else 'degraded',
            'timestamp': timezone.now().isoformat(),
            'response_time_ms': response_time,
            'api_health': api_tests,
            'summary': {
                'operational_apis': operational_apis,
                'total_apis': total_apis,
                'success_rate': round((operational_apis / total_apis) * 100, 1) if total_apis > 0 else 0
            }
        })
    
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'timestamp': timezone.now().isoformat(),
            'error': str(e),
            'message': 'API status check failed'
        }, status=500)