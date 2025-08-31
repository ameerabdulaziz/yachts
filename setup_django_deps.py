#!/usr/bin/env python3
"""Install Django dependencies for Nauttec platform"""
import subprocess
import sys

def install_package(package):
    """Install a single package"""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', package, '--quiet'])
        print(f"✓ {package}")
        return True
    except subprocess.CalledProcessError:
        print(f"✗ {package}")
        return False

packages = [
    'djangorestframework',
    'django-cors-headers', 
    'psycopg2-binary',
    'python-decouple',
    'drf-spectacular',
    'Pillow'
]

print("Installing Django REST API dependencies...")
for pkg in packages:
    install_package(pkg)

print("Dependencies installation completed!")