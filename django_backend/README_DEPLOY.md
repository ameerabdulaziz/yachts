# Nauttec Django Backend - Git Repository

This is the Django REST API backend for the Nauttec yacht platform.

## Repository Setup

This repository contains:
- Complete Django 4.2.7 backend with 7 apps
- 34 REST API endpoints with Postman documentation
- Phone-based authentication with OTP verification
- Stripe payment integration
- Health monitoring system
- Comprehensive test data and documentation

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Environment setup
cp .env.example .env
# Configure your environment variables

# Database setup
python manage.py migrate
python simple_seed_task14.py

# Start server
python manage.py runserver
```

## API Documentation

- Import `nauttec_postman_collection.json` into Postman
- 34 endpoints across 9 functional areas
- Complete authentication flow and testing scenarios

## Health Monitoring

- `GET /health/` - System health
- `GET /health/database/` - Database status
- `POST /health/test-systems/` - Comprehensive testing

## Production Ready

- Environment configuration templates
- Comprehensive documentation
- Health monitoring endpoints
- Security best practices implemented