#!/usr/bin/env python
"""
Django Production Server Startup Script
Starts the Nauttec Django backend with proper configuration
"""
import os
import sys
import django
from django.core.management import execute_from_command_line
from django.core.wsgi import get_wsgi_application

def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
    django.setup()

def run_server():
    """Run Django development server"""
    print("🚀 Starting Nauttec Django Backend...")
    print("📍 Server will be available at: http://localhost:8000")
    print("🔗 Health Check: http://localhost:8000/health/")
    print("📋 API Endpoints: 40+ endpoints organized by Django apps")
    print("📖 Postman Collection: nauttec_comprehensive_api_collection.json")
    print("=" * 60)
    
    # Apply migrations first
    print("🔄 Applying database migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Start development server
    print("🌟 Starting development server...")
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])

if __name__ == '__main__':
    setup_django()
    run_server()