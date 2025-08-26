# Nauttec Yacht Platform - Django Backend

## Overview
Django REST Framework backend for the Nauttec fractional yacht ownership and charter platform. Features authentic De Antonio yacht fleet (D29-D60) with sophisticated booking rules, share trading marketplace, and comprehensive ownership management.

## Key Features
- **Fractional Ownership**: 48-day/50-hour usage limits per share
- **Share Trading**: 30-day right of first refusal system
- **OAuth Authentication**: Google/Facebook integration
- **Dynamic Pricing**: Seasonal multipliers and demand-based rates
- **Fuel Wallet System**: Prepaid virtual fuel management
- **Admin Dashboard**: Comprehensive yacht and booking management

## Technology Stack
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL with advanced relationships
- **Authentication**: OAuth2 + JWT tokens
- **Background Tasks**: Celery with Redis
- **Storage**: WhiteNoise for static files

## Project Structure
```
django_backend/
├── accounts/          # User management and authentication
├── yachts/           # De Antonio yacht fleet management  
├── bookings/         # Charter reservations and usage tracking
├── ownership/        # Fractional ownership and share structures
├── shares/           # Peer-to-peer share trading marketplace
├── messaging/        # User communication system
├── fuel_wallet/      # Prepaid fuel management
└── nauttec_platform/ # Django project settings
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - Login with email/password
- `GET /api/auth/user/` - Current user profile
- `GET /o/authorize/` - OAuth authorization

### Yacht Management
- `GET /api/v1/yachts/` - List all yachts with filtering
- `GET /api/v1/yachts/{id}/` - Yacht details
- `GET /api/v1/yachts/{id}/availability/` - Availability calendar
- `GET /api/v1/yachts/{id}/pricing/` - Dynamic pricing
- `GET /api/v1/yachts/featured/` - Featured yachts

### Ownership & Trading
- `GET /api/v1/ownership/` - Ownership opportunities
- `POST /api/v1/ownership/{id}/purchase/` - Purchase shares
- `GET /api/v1/shares/` - Share marketplace
- `POST /api/v1/shares/` - List shares for sale

## Installation & Setup

### 1. Clone and Setup
```bash
cd django_backend
pip install -r requirements.txt
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 4. Load Initial Data
```bash
python manage.py loaddata yachts/fixtures/de_antonio_fleet.json
python manage.py loaddata ownership/fixtures/ownership_opportunities.json
```

### 5. Run Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

### 6. Start Background Tasks
```bash
celery -A nauttec_platform worker -l info
celery -A nauttec_platform beat -l info
```

## API Documentation
- **Interactive Docs**: http://localhost:8000/api/docs/
- **Admin Interface**: http://localhost:8000/admin/
- **API Root**: http://localhost:8000/api/v1/

## Key Models

### User Model
- Custom user with yacht ownership roles
- OAuth integration (Google/Facebook)
- Fuel wallet balance tracking
- Investment preferences

### Yacht Model
- Authentic De Antonio specifications (D29-D60)
- Dynamic pricing with seasonal multipliers
- Availability calendar management
- High-resolution image galleries

### Ownership Model
- Fractional share structures (1/8, 1/6, 1/4, etc.)
- Usage tracking (days/hours per year)
- Financing options with monthly payments
- Right of first refusal enforcement

## Deployment

### Production Settings
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = ['https://your-frontend.com']
```

### Database Migration
```bash
python manage.py collectstatic
python manage.py migrate --run-syncdb
```

### WSGI Server
```bash
gunicorn nauttec_platform.wsgi:application --bind 0.0.0.0:8000
```

## OAuth Setup

### Google OAuth
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs
4. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

### Facebook OAuth  
1. Go to Facebook Developers
2. Create new app with Facebook Login
3. Configure Valid OAuth Redirect URIs
4. Update FACEBOOK_APP_ID and FACEBOOK_APP_SECRET

## Contributing
This Django backend provides the complete foundation for yacht fractional ownership with sophisticated booking rules, share trading capabilities, and comprehensive user management.