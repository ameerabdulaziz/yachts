# Nauttec Yacht Platform

A comprehensive fractional yacht ownership and rental platform built with Django REST Framework. Nauttec revolutionizes luxury boating access by enabling fractional ownership, sophisticated booking rules, and peer-to-peer share trading for the De Antonio Yachts range (D29-D60).

## 🎯 Platform Overview

**Nauttec** is a premium yacht platform that provides:
- **Fractional Ownership** - Multiple ownership structures with usage limits
- **Advanced Booking System** - Sophisticated rules engine with seasonal multipliers
- **Fuel Wallet Management** - Prepaid virtual fuel credits with auto-top-up
- **Lead Management** - Advanced inquiry capture with intelligent scoring
- **In-App Notifications** - Templated messaging system with user preferences
- **Payment Integration** - Complete Stripe payment processing
- **Share Trading** - Peer-to-peer marketplace with right of first refusal

## 🛥️ Yacht Fleet

The platform features the complete **De Antonio Yachts** range:
- **D29** - 8 guests, €1,200/day
- **D33** - 10 guests, €1,800/day  
- **D42** - 12 guests, €2,800/day
- **D50** - 14 guests, €4,200/day
- **D60** - 16 guests, €6,500/day

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Django 4.2.7
- SQLite (for development)
- Stripe account (for payments)

### Installation

1. **Navigate to backend**:
```bash
cd django_backend
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Environment setup**:
```bash
cp ../.env.example .env
# Configure your environment variables
```

4. **Database setup**:
```bash
python manage.py migrate
python simple_seed_task14.py  # Load test data
```

5. **Start the server**:
```bash
python manage.py runserver
# Server runs on http://localhost:8000
```

## 📱 API Documentation

Complete API documentation is available via **Postman Collection**:
- Import `../nauttec_postman_collection.json` into Postman
- **34 endpoints** across 9 functional areas
- Authentication, fleet management, bookings, payments, and more
- Ready-to-use examples with test data

## 🏗️ Architecture

### Django Apps
1. **accounts** - User management and authentication
2. **boats** - Yacht fleet and specifications
3. **bookings** - Reservation system with rules engine
4. **ownership** - Fractional ownership and fuel wallets
5. **payment_system** - Stripe integration and transaction history
6. **inquiries** - Lead management with scoring algorithm
7. **notify_system** - In-app notifications and templates

## 🔧 Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=your_database_url

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Authentication
SESSION_SECRET=your_session_secret
```

## 🧪 Testing

### Test Data
Load comprehensive test data:
```bash
python simple_seed_task14.py
```

### Health Checks
```bash
GET /health/              # System health
GET /health/database/     # Database connectivity
POST /health/test-systems/ # Comprehensive system test
```

## 💳 Payment Integration

### Stripe Setup
1. Create Stripe account at https://dashboard.stripe.com
2. Get your API keys:
   - **Publishable key** (starts with `pk_`) → `VITE_STRIPE_PUBLIC_KEY`
   - **Secret key** (starts with `sk_`) → `STRIPE_SECRET_KEY`

## 📊 Business Logic

### Fractional Ownership
- **Share types**: 1/8, 1/4, 1/2, Full ownership
- **Usage limits**: 48 days per year per share
- **Co-owner management** with usage tracking

### Fuel Wallet System
- **Prepaid virtual fuel credits** for yacht usage
- **Auto-top-up functionality** when balance is low
- **Usage tracking** per booking

## 🚢 Deployment

### Production Checklist
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Set up SSL certificates
- [ ] Configure Stripe webhooks
- [ ] Set up monitoring and logging