#!/usr/bin/env python
"""
Django Server Workflow Starter
Starts Django development server on port 8000 for API testing
"""
import os
import subprocess
import sys

def start_django_server():
    """Start Django development server"""
    try:
        print("🚀 Starting Django development server on port 8000...")
        print("📋 Available endpoints:")
        print("   - Health check: http://localhost:8000/healthz/")
        print("   - Admin: http://localhost:8000/admin/")
        print("   - OTP request: POST http://localhost:8000/auth/request-otp/")
        print("   - OTP verify: POST http://localhost:8000/auth/verify-otp/")
        print("   - Boats API: GET http://localhost:8000/boats/")
        print("   - Boat detail: GET http://localhost:8000/boats/{id}/")
        print("")
        
        # Start Django server
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
        ])
        
    except KeyboardInterrupt:
        print("\n🛑 Django server stopped")
    except Exception as e:
        print(f"❌ Error starting Django server: {e}")

if __name__ == '__main__':
    start_django_server()