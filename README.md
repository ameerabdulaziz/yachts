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

1. **Clone and setup**:
```bash
git clone <repository-url>
cd nauttec-platform
```

2. **Frontend setup** (Node.js/React):
```bash
npm install
npm run dev
# Frontend runs on http://localhost:5000
```

3. **Backend setup** (Django API):
```bash
cd django_backend
pip install -r requirements.txt
cp ../.env.example .env
# Configure your environment variables
python manage.py migrate
python simple_seed_task14.py  # Load test data
python manage.py runserver
# Backend API runs on http://localhost:8000
```

## 📱 API Documentation

Complete API documentation is available via **Postman Collection**:
- Import `nauttec_postman_collection.json` into Postman
- **34 endpoints** across 9 functional areas
- Authentication, fleet management, bookings, payments, and more
- Ready-to-use examples with test data

### Key API Endpoints

#### Authentication
```
POST /auth/register/         # Create new user account
POST /auth/send-otp/         # Send OTP verification
POST /auth/verify-otp/       # Verify phone number
POST /auth/login/            # User login
```

#### Yacht Fleet
```
GET  /boats/                 # List all yachts
GET  /boats/{id}/            # Yacht details
GET  /boats/{id}/availability/ # Check availability
```

#### Bookings
```
POST /bookings/              # Create booking
GET  /bookings/              # User bookings
POST /bookings/{id}/cancel/  # Cancel booking
```

#### Payments
```
POST /payment-intents/       # Create payment
GET  /payment-intents/       # Payment history
POST /payment-intents/{id}/confirm/ # Confirm payment
```

## 🏗️ Architecture

### Backend Stack
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (development)
- **Stripe** - Payment processing
- **Phone Authentication** - OTP-based login

### Django Apps
1. **accounts** - User management and authentication
2. **boats** - Yacht fleet and specifications
3. **bookings** - Reservation system with rules engine
4. **ownership** - Fractional ownership and fuel wallets
5. **payment_system** - Stripe integration and transaction history
6. **inquiries** - Lead management with scoring algorithm
7. **notify_system** - In-app notifications and templates

### Key Features

#### Advanced Booking Rules
- **48-day annual limits** per ownership share
- **Seasonal multipliers** for peak periods
- **Fuel threshold enforcement** for owner bookings
- **Conflict detection** and availability management

#### Lead Scoring Algorithm
Intelligent inquiry scoring (0-100 points) based on:
- **Budget alignment** (40 points max)
- **Timeline urgency** (20 points max)
- **Inquiry type priority** (20 points max)
- **Contact completeness** (20 points max)

#### Notification System
- **14 notification types** covering all platform activities
- **Template engine** with dynamic context variables
- **User preferences** for channels and quiet hours
- **Priority levels** (low, medium, high, urgent)

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

# Optional: SMS/OTP Service
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### Django Settings
Key configuration in `yachtak_api/settings.py`:
- Phone-based authentication system
- Stripe payment integration
- CORS and API permissions
- Database configuration

## 🧪 Testing

### Test Data
Load comprehensive test data:
```bash
python simple_seed_task14.py
```

This creates:
- 5 international users with phone authentication
- 6 yachts across the De Antonio range
- Multiple bookings with various statuses
- Inquiry samples with lead scoring
- Notification examples

### API Testing
Use the provided Postman collection:
1. Import `nauttec_postman_collection.json`
2. Set base_url to your server (default: `http://localhost:8000`)
3. Test all 34 endpoints with example data

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
3. Configure webhook endpoints for production

### Payment Flow
1. **Create Payment Intent** - Initialize payment with amount
2. **Client Confirmation** - Frontend handles card details
3. **Webhook Processing** - Automated status updates
4. **Booking Confirmation** - Automatic booking status change

## 📊 Business Logic

### Fractional Ownership
- **Share types**: 1/8, 1/4, 1/2, Full ownership
- **Usage limits**: 48 days per year per share
- **Co-owner management** with usage tracking
- **Share trading marketplace** with 30-day right of first refusal

### Fuel Wallet System
- **Prepaid virtual fuel credits** for yacht usage
- **Auto-top-up functionality** when balance is low
- **Usage tracking** per booking
- **Low balance notifications** and alerts

### Booking Rules Engine
- **Seasonal rate multipliers** (peak/off-peak pricing)
- **Advance booking requirements** by yacht class
- **Owner priority periods** for high-demand dates
- **Minimum stay requirements** for premium yachts

## 📈 Monitoring & Analytics

### Health Monitoring
- Database connectivity checks
- Payment system status
- API endpoint availability
- System performance metrics

### Business Analytics
- Booking conversion rates
- Lead scoring effectiveness
- Revenue per yacht
- Owner usage patterns

## 🚢 Deployment

### Production Checklist
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Set up SSL certificates
- [ ] Configure Stripe webhooks
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up error tracking
- [ ] Configure email/SMS notifications

### Environment Setup
```bash
# Production environment variables
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/db
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Submit pull request with detailed description

### Code Standards
- Follow Django best practices
- Use phone-based authentication flow
- Maintain API consistency
- Add comprehensive tests for new features

## 📞 Support

For technical support or business inquiries:
- **Platform**: Nauttec Yacht Management
- **API Documentation**: See Postman collection
- **Issue Tracking**: GitHub Issues

## 📄 License

This project is proprietary software developed for Nauttec yacht platform.

---

**Built with Django 4.2.7 | Stripe Payments | Phone Authentication**

*Revolutionizing luxury yacht access through fractional ownership*