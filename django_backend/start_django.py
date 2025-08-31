#!/usr/bin/env python3
"""
Bootstrap script to start Django development server for Nauttec Yacht Platform
Following the task board requirements
"""
import os
import sys
import subprocess

# Add django_backend/src to Python path
sys.path.insert(0, 'django_backend/src')

def install_requirements():
    """Install required packages"""
    packages = [
        'Django==4.2.7',
        'djangorestframework==3.14.0', 
        'django-cors-headers==4.3.1',
        'psycopg2-binary==2.9.9',
        'python-decouple==3.8',
        'Pillow==10.1.0',
        'django-filter==23.3',
        'djoser==2.2.0',
        'gunicorn==21.2.0',
        'whitenoise==6.6.0',
        'drf-spectacular==0.26.5'
    ]
    
    print("Installing Django and required packages...")
    for package in packages:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"✓ {package}")
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to install {package}: {e}")

def setup_environment():
    """Set up environment variables"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nauttec_platform.settings')
    
    # Set Django environment variables if not already set
    if not os.getenv('SECRET_KEY'):
        os.environ['SECRET_KEY'] = 'nauttec-yacht-platform-development-secret'
    if not os.getenv('DEBUG'):
        os.environ['DEBUG'] = 'True'

def run_django_setup():
    """Run Django management commands"""
    os.chdir('django_backend/src')
    
    print("Running Django setup...")
    
    # Check Django installation
    try:
        import django
        print(f"✓ Django {django.get_version()} installed")
    except ImportError:
        install_requirements()
        import django
        
    # Setup Django
    django.setup()
    
    # Run management commands
    from django.core.management import execute_from_command_line
    
    print("Running migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    print("Creating superuser if needed...")
    # This will be handled in the next step
    
    print("Starting development server on port 8000...")
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])

if __name__ == '__main__':
    setup_environment()
    run_django_setup()