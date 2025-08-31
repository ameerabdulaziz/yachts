#!/usr/bin/env python3
"""
Start Django development server for Nauttec Yacht Platform
Task 0 - Bootstrap & Environment
"""
import os
import sys
import subprocess

# Set Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'yachtak_api.settings'

def start_server():
    """Start Django development server on port 8000"""
    print("🚀 Starting Nauttec Django API server...")
    print("📋 Task 0 - Bootstrap & Environment: COMPLETED")
    print("🌐 Server will be available at: http://localhost:8000")
    print("⚡ Health check: http://localhost:8000/healthz/")
    print("🔧 Admin interface: http://localhost:8000/admin/")
    
    try:
        # Run Django development server
        subprocess.run([
            sys.executable, 
            'manage.py', 
            'runserver', 
            '0.0.0.0:8000'
        ], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Django server stopped.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server error: {e}")

if __name__ == '__main__':
    start_server()