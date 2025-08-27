#!/usr/bin/env python3
"""
Start script for Nauttec Python backend
Detects available dependencies and starts appropriate server
"""
import subprocess
import sys
import os

def start_python_backend():
    """Start the appropriate Python backend"""
    print("🚀 Starting Nauttec Python Backend...")
    
    try:
        # Try to start the comprehensive Python API
        print("📡 Launching Nauttec Python API Server...")
        subprocess.run([sys.executable, 'nauttec_python_api.py'], cwd='django_backend')
    except KeyboardInterrupt:
        print("\n✋ Backend stopped by user")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_python_backend()