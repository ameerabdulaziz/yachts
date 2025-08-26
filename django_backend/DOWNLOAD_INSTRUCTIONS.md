# Nauttec Django Backend - Download Instructions

## 📦 Backend Package Contents

This Django REST Framework backend contains:

```
nauttec_django_backend/
├── accounts/              # User management & authentication
│   ├── models.py         # Custom User model with yacht roles
│   └── serializers.py    # User API serializers
├── yachts/               # De Antonio yacht fleet (D29-D60)  
│   ├── models.py         # Yacht, specs, availability models
│   ├── serializers.py    # Yacht API serializers
│   └── views.py          # Yacht discovery API endpoints
├── bookings/             # Charter reservations
│   └── models.py         # Booking, payments, reviews
├── ownership/            # Fractional ownership system
│   └── models.py         # Shares, transfers, waitlist
├── nauttec_platform/     # Django project settings
│   ├── settings.py       # Complete Django configuration
│   └── urls.py           # API routing
├── requirements.txt      # All Django dependencies
├── manage.py            # Django management commands
├── .env.example         # Environment variables template
└── README.md            # Setup and deployment guide
```

## 🚀 Quick Setup

1. **Extract the archive:**
   ```bash
   tar -xzf nauttec_django_backend.tar.gz
   cd nauttec_django_backend/
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Run development server:**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

## 🔗 API Endpoints

- **Admin Interface**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/docs/
- **Yacht Discovery**: http://localhost:8000/api/v1/yachts/
- **Authentication**: http://localhost:8000/api/auth/

## 📱 Integration

Your React frontend can connect to this Django backend by updating the API base URL:

```javascript
const API_BASE = 'http://localhost:8000/api/v1'
```

## 🎯 Key Features

- **Django 4.2 LTS** with REST Framework
- **Custom User Model** with yacht ownership roles
- **OAuth Integration** (Google/Facebook)
- **Fractional Ownership** with 48-day/50-hour usage limits
- **Share Trading** with 30-day right of first refusal
- **Dynamic Pricing** with seasonal multipliers
- **Comprehensive Admin Interface**
- **Production Ready** with Celery, Redis, and PostgreSQL

The backend provides enterprise-grade yacht platform capabilities with sophisticated fractional ownership rules and comprehensive API documentation.