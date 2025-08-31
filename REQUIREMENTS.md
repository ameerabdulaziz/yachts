# Nauttec Platform Dependencies

## Core Django Framework
- Django 4.2.7 - Web framework
- djangorestframework - API development
- django-cors-headers - CORS handling

## Database
- psycopg2-binary - PostgreSQL adapter
- dj-database-url - Database URL parsing

## Payment Processing
- stripe - Payment processing integration

## Authentication & Security
- django-phonenumber-field - Phone number validation
- phonenumbers - Phone number utilities
- cryptography - Security utilities

## Communication
- twilio - SMS/OTP services (optional)
- sendgrid - Email services (optional)

## Utilities
- requests - HTTP client
- Pillow - Image processing
- python-dateutil - Date utilities

## Production Deployment
- gunicorn - WSGI server
- whitenoise - Static file serving
- redis - Caching (optional)
- celery - Background tasks (optional)

## Monitoring & Logging
- sentry-sdk - Error tracking (optional)
- newrelic - Performance monitoring (optional)

## Development & Testing
- pytest - Testing framework
- pytest-django - Django testing
- factory-boy - Test data generation

## Installation Command
```bash
pip install Django==4.2.7 djangorestframework django-cors-headers psycopg2-binary stripe
```