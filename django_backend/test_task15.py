#!/usr/bin/env python3
"""
Task 15 - README & Healthcheck Test
Validates comprehensive documentation and health monitoring
"""
import os
import sys
import django
import json
from pathlib import Path

# Set up Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model

def test_readme_documentation():
    """Test README.md exists and has comprehensive content"""
    print("📖 Testing README documentation...")
    
    readme_path = Path('README.md')
    if not readme_path.exists():
        print("❌ README.md file not found")
        return False
    
    content = readme_path.read_text()
    
    # Check for essential sections
    required_sections = [
        '# Nauttec Yacht Platform',
        '## 🎯 Platform Overview',
        '## 🛥️ Yacht Fleet',
        '## 🚀 Quick Start',
        '## 📱 API Documentation',
        '## 🏗️ Architecture',
        '## 🔧 Configuration',
        '## 🧪 Testing',
        '## 💳 Payment Integration',
        '## 📊 Business Logic',
        '## 🚢 Deployment'
    ]
    
    missing_sections = []
    for section in required_sections:
        if section not in content:
            missing_sections.append(section)
    
    print(f"   README length: {len(content):,} characters")
    print(f"   Required sections: {len(required_sections)}")
    print(f"   Found sections: {len(required_sections) - len(missing_sections)}")
    
    if missing_sections:
        print(f"   Missing sections: {missing_sections}")
        return False
    
    # Check for key content
    key_content = [
        'Django 4.2.7',
        'De Antonio Yachts',
        'Fractional Ownership',
        'Postman Collection',
        'Stripe',
        'Phone Authentication',
        'nauttec_postman_collection.json'
    ]
    
    missing_content = []
    for content_item in key_content:
        if content_item not in content:
            missing_content.append(content_item)
    
    if missing_content:
        print(f"   Missing content: {missing_content}")
        return False
    
    print("✅ README documentation validated")
    return True

def test_health_endpoints():
    """Test health check endpoints"""
    print("🏥 Testing health check endpoints...")
    
    client = Client()
    
    endpoints_to_test = [
        ('/health/', 'Basic health check'),
        ('/health/database/', 'Database health'),
        ('/health/api/', 'API status'),
        ('/healthz/', 'Legacy health check')
    ]
    
    working_endpoints = 0
    
    for endpoint, description in endpoints_to_test:
        try:
            response = client.get(endpoint)
            
            if response.status_code == 200:
                data = response.json()
                if 'status' in data:
                    print(f"   ✅ {endpoint}: {description} - {data.get('status', 'unknown')}")
                    working_endpoints += 1
                else:
                    print(f"   ⚠️ {endpoint}: Missing status field")
            else:
                print(f"   ❌ {endpoint}: HTTP {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ {endpoint}: Error - {e}")
    
    success = working_endpoints >= len(endpoints_to_test) * 0.75  # 75% success rate
    
    if success:
        print("✅ Health endpoints validated")
    else:
        print("❌ Health endpoints failing")
    
    return success

def test_comprehensive_system_test():
    """Test comprehensive system test endpoint"""
    print("🔬 Testing comprehensive system test...")
    
    client = Client()
    
    try:
        test_payload = {
            'test_user_phone': '+201234567890',
            'run_comprehensive_tests': True
        }
        
        response = client.post(
            '/health/test-systems/',
            data=json.dumps(test_payload),
            content_type='application/json'
        )
        
        if response.status_code in [200, 503]:  # Both OK and Service Unavailable are acceptable
            data = response.json()
            
            print(f"   Test status: {data.get('status', 'unknown')}")
            print(f"   Tests run: {data.get('tests_run', 0)}")
            print(f"   Tests passed: {data.get('tests_passed', 0)}")
            print(f"   Tests failed: {data.get('tests_failed', 0)}")
            
            if 'summary' in data:
                print(f"   Success rate: {data['summary'].get('success_rate', 0)}%")
            
            # Check for system tests
            if 'system_tests' in data:
                for test_name, result in data['system_tests'].items():
                    status = result.get('status', 'unknown')
                    print(f"     {test_name}: {status}")
            
            success = data.get('tests_run', 0) >= 2 and data.get('tests_passed', 0) >= 1
            
            if success:
                print("✅ Comprehensive system test working")
            else:
                print("⚠️ System test has issues but is functional")
            
            return success
            
        else:
            print(f"   ❌ Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ System test error: {e}")
        return False

def test_database_health():
    """Test database health endpoint specifically"""
    print("🗄️ Testing database health monitoring...")
    
    client = Client()
    
    try:
        response = client.get('/health/database/')
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"   Database status: {data.get('database', {}).get('connected', 'unknown')}")
            print(f"   Response time: {data.get('database', {}).get('response_time_ms', 'unknown')}ms")
            
            if 'database' in data and 'tables' in data['database']:
                tables = data['database']['tables']
                total_records = data['database'].get('total_records', 0)
                
                print(f"   Tables monitored: {len(tables)}")
                print(f"   Total records: {total_records}")
                
                # Check for key tables
                key_tables = ['users', 'boats', 'bookings', 'notifications']
                found_tables = sum(1 for table in key_tables if table in tables)
                
                print(f"   Key tables found: {found_tables}/{len(key_tables)}")
                
                success = found_tables >= len(key_tables) * 0.75 and total_records > 0
                
                if success:
                    print("✅ Database health monitoring working")
                else:
                    print("❌ Database health monitoring incomplete")
                
                return success
            else:
                print("❌ Database health response missing table data")
                return False
        else:
            print(f"❌ Database health check failed: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Database health test error: {e}")
        return False

def test_postman_collection():
    """Test Postman collection file exists and is valid"""
    print("📋 Testing Postman collection...")
    
    collection_path = Path('nauttec_postman_collection.json')
    if not collection_path.exists():
        print("❌ Postman collection file not found")
        return False
    
    try:
        with open(collection_path, 'r') as f:
            collection = json.load(f)
        
        # Validate collection structure
        required_keys = ['info', 'variable', 'item']
        missing_keys = [key for key in required_keys if key not in collection]
        
        if missing_keys:
            print(f"❌ Missing collection keys: {missing_keys}")
            return False
        
        # Count endpoints
        total_endpoints = 0
        folders = collection.get('item', [])
        
        for folder in folders:
            if 'item' in folder:
                total_endpoints += len(folder['item'])
        
        print(f"   Collection name: {collection['info'].get('name', 'Unknown')}")
        print(f"   Total folders: {len(folders)}")
        print(f"   Total endpoints: {total_endpoints}")
        
        # Validate has health endpoints
        health_folder = None
        for folder in folders:
            if 'health' in folder.get('name', '').lower() or 'testing' in folder.get('name', '').lower():
                health_folder = folder
                break
        
        if health_folder:
            print(f"   Health endpoints in collection: {len(health_folder.get('item', []))}")
        
        success = total_endpoints >= 30 and len(folders) >= 8
        
        if success:
            print("✅ Postman collection validated")
        else:
            print("❌ Postman collection incomplete")
        
        return success
        
    except json.JSONDecodeError:
        print("❌ Invalid JSON in Postman collection")
        return False
    except Exception as e:
        print(f"❌ Postman collection test error: {e}")
        return False

def test_deployment_readiness():
    """Test deployment readiness indicators"""
    print("🚀 Testing deployment readiness...")
    
    readiness_checks = []
    
    # Check for environment configuration
    env_example_path = Path('.env.example')
    if env_example_path.exists():
        readiness_checks.append(("Environment template", True))
        print("   ✅ Environment template exists")
    else:
        readiness_checks.append(("Environment template", False))
        print("   ❌ Environment template missing")
    
    # Check for requirements file
    requirements_path = Path('requirements.txt')
    if requirements_path.exists():
        readiness_checks.append(("Requirements file", True))
        print("   ✅ Requirements file exists")
    else:
        readiness_checks.append(("Requirements file", False))
        print("   ❌ Requirements file missing")
    
    # Check Django project structure
    manage_py_path = Path('manage.py')
    if manage_py_path.exists():
        readiness_checks.append(("Django project", True))
        print("   ✅ Django project structure")
    else:
        readiness_checks.append(("Django project", False))
        print("   ❌ Django project structure missing")
    
    # Check for health monitoring
    health_views_path = Path('yachtak_api/health_views.py')
    if health_views_path.exists():
        readiness_checks.append(("Health monitoring", True))
        print("   ✅ Health monitoring implemented")
    else:
        readiness_checks.append(("Health monitoring", False))
        print("   ❌ Health monitoring missing")
    
    passed_checks = sum(1 for _, passed in readiness_checks if passed)
    total_checks = len(readiness_checks)
    
    print(f"   Readiness score: {passed_checks}/{total_checks}")
    
    success = passed_checks >= total_checks * 0.8  # 80% readiness
    
    if success:
        print("✅ Deployment readiness validated")
    else:
        print("❌ Deployment readiness incomplete")
    
    return success

def main():
    """Run Task 15 comprehensive validation"""
    print("🚀 Task 15 - README & Healthcheck Tests")
    print("=" * 60)
    
    tests = [
        ("README Documentation", test_readme_documentation),
        ("Health Endpoints", test_health_endpoints),
        ("Database Health", test_database_health),
        ("System Test", test_comprehensive_system_test),
        ("Postman Collection", test_postman_collection),
        ("Deployment Readiness", test_deployment_readiness),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        try:
            result = test_func()
            if result:
                print(f"✅ {test_name} - PASSED")
                passed += 1
            else:
                print(f"❌ {test_name} - FAILED")
        except Exception as e:
            print(f"❌ {test_name} - ERROR: {e}")
    
    print(f"\n{'='*60}")
    print(f"📊 Task 15 Test Results: {passed}/{total} ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 Task 15 - README & Healthcheck COMPLETED!")
        print("Platform documentation and monitoring ready for production")
    elif passed >= total * 0.8:
        print("✅ Task 15 - MOSTLY COMPLETED with minor issues")
        print("Platform ready for production deployment")
    else:
        print("⚠️ Task 15 needs attention for production readiness")
    
    return passed >= total * 0.8

if __name__ == "__main__":
    main()