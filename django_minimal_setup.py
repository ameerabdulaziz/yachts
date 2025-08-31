#!/usr/bin/env python3
"""
Minimal Django setup for Task 0 - Bootstrap & Environment
Creating a simple Django API to work with the existing React frontend
"""
import os
import sys

# Minimal Django settings - Task 0 requirements
DJANGO_SETTINGS = """
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'nauttec-yacht-platform-development-secret-key')
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware', 
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'nauttec_platform.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'nauttec_platform.wsgi.application'

# Database - Use existing PostgreSQL connection
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('PGDATABASE'),
        'USER': os.getenv('PGUSER'), 
        'PASSWORD': os.getenv('PGPASSWORD'),
        'HOST': os.getenv('PGHOST'),
        'PORT': os.getenv('PGPORT'),
    }
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
"""

# Create minimal Django project structure
def create_minimal_django():
    """Create minimal Django project for Task 0"""
    
    # Create yachtak_api directory (following task board naming)
    os.makedirs('yachtak_api', exist_ok=True)
    
    # Create settings.py
    with open('yachtak_api/settings.py', 'w') as f:
        f.write(DJANGO_SETTINGS)
    
    # Create __init__.py
    with open('yachtak_api/__init__.py', 'w') as f:
        f.write('')
    
    # Create minimal urls.py
    urls_content = '''
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

def healthz(request):
    """Health check endpoint - Task 15 requirement"""
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('healthz/', healthz, name='healthz'),
]
'''
    with open('yachtak_api/urls.py', 'w') as f:
        f.write(urls_content)
    
    # Create wsgi.py
    wsgi_content = '''
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
application = get_wsgi_application()
'''
    with open('yachtak_api/wsgi.py', 'w') as f:
        f.write(wsgi_content)
    
    # Create manage.py
    manage_content = '''#!/usr/bin/env python
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yachtak_api.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)
'''
    with open('manage.py', 'w') as f:
        f.write(manage_content)
    
    # Make manage.py executable
    os.chmod('manage.py', 0o755)
    
    print("✓ Created minimal Django project structure")
    print("✓ Task 0 - Bootstrap & Environment: Basic structure ready")
    
    # Set Django settings module
    os.environ['DJANGO_SETTINGS_MODULE'] = 'yachtak_api.settings'
    
    return True

if __name__ == '__main__':
    create_minimal_django()
    print("Django minimal setup completed!")
    print("Ready to start Task 1 - OTP Auth implementation")