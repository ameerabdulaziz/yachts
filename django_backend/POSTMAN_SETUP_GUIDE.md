# Nauttec Postman Collection Setup Guide

## Overview

This guide provides comprehensive Postman collections for the Nauttec Django backend API with 40+ endpoints organized by Django apps.

## Files Included

### 1. Collection File
- **`nauttec_comprehensive_api_collection.json`** - Complete API collection with 40+ endpoints

### 2. Environment File  
- **`nauttec_postman_environment.json`** - Pre-configured environment variables

## Quick Setup

### Step 1: Import Collection
1. Open Postman
2. Click **Import** button
3. Select **`nauttec_comprehensive_api_collection.json`**
4. Collection appears with 9 organized folders

### Step 2: Import Environment
1. Click **Environments** in Postman
2. Click **Import**
3. Select **`nauttec_postman_environment.json`**
4. Select the imported environment from dropdown

### Step 3: Configure Base URL
Update environment variables based on your setup:
- **Local Development**: `http://localhost:8000` (default)
- **Production**: `https://api.nauttec.com`

## Collection Organization

### 01. Authentication & Accounts (6 endpoints)
- User registration with phone verification
- OTP-based authentication flow
- Password management
- User profile access

### 02. Yacht Fleet Management (5 endpoints)
- Complete yacht listings
- Yacht details and specifications
- Availability checking
- Advanced filtering (capacity, location)

### 03. Booking Management (6 endpoints)
- Create and manage bookings
- Booking history and details
- Cancellation handling
- Admin booking overview

### 04. Fractional Ownership (5 endpoints)
- Ownership share management
- Fuel wallet operations
- Transaction history
- Co-owner management

### 05. Payment System (4 endpoints)
- Stripe payment integration
- Payment intent creation
- Payment confirmation
- Payment history tracking

### 06. Lead Management & Inquiries (5 endpoints)
- Customer inquiry capture
- Lead scoring system
- Qualified lead filtering
- Source analytics

### 07. Notification System (5 endpoints)
- In-app notification feed
- Read/unread management
- Notification preferences
- Test notification system

### 08. Health Monitoring & Testing (5 endpoints)
- System health checks
- Database monitoring
- API status verification
- Comprehensive testing

### 09. Admin & Analytics (4 endpoints)
- Platform statistics
- User analytics
- Booking performance
- Revenue tracking

## Environment Variables

### Core URLs
- `base_url` - API base URL (localhost:8000)
- `prod_url` - Production URL

### Test Users
- `test_user_phone` - Primary test user (+201234567890)
- `test_user_phone_2` - Owner test user (+33123456789)
- `test_user_phone_3` - Additional test user (+34987654321)

### Dynamic Variables
- `auth_token` - Authentication token (auto-populated)
- `session_id` - Session identifier
- `payment_intent_id` - Payment tracking
- `booking_id` - Booking reference
- `boat_id` - Yacht identifier
- `inquiry_id` - Lead tracking
- `notification_id` - Notification reference

## Testing Workflows

### Complete User Journey
1. **Authentication Flow** (Folder 01)
   - Register → Send OTP → Verify → Set Password → Login

2. **Browse & Book** (Folders 02-03)
   - List Yachts → Check Availability → Create Booking

3. **Payment Process** (Folder 05)
   - Create Payment Intent → Confirm Payment

4. **Ownership Management** (Folder 04)
   - Check Ownership → Manage Fuel Wallet

### Admin Workflows
1. **System Monitoring** (Folder 08)
   - Health Checks → Database Status → System Tests

2. **Lead Management** (Folder 06)
   - Review Inquiries → Lead Scoring → Analytics

3. **Platform Analytics** (Folder 09)
   - User Stats → Booking Analytics → Revenue Reports

## Authentication Setup

### Automatic Token Management
The collection includes pre-request scripts that automatically:
- Extract authentication tokens from login responses
- Set session cookies for subsequent requests
- Handle CSRF token management

### Manual Token Setup
If needed, manually set tokens in environment:
1. Login via `/auth/login/` endpoint
2. Copy token from response
3. Set `auth_token` variable in environment

## Production Deployment

### Environment Switch
1. Duplicate environment for production
2. Update `base_url` to production URL
3. Configure production test users
4. Test all critical endpoints

### Security Considerations
- Never commit API keys to version control
- Use environment-specific test data
- Validate all endpoints in production
- Monitor API performance and errors

## Troubleshooting

### Common Issues

**Authentication Failures**
- Verify phone number format (+country_code)
- Check OTP code hasn't expired
- Ensure password meets requirements

**Endpoint Errors**
- Confirm Django server is running
- Check base_url in environment
- Verify request payload format

**Database Issues**
- Run health checks first
- Ensure test data is loaded
- Check database connectivity

### Support Resources
- Health monitoring endpoints for system status
- Comprehensive error responses with details
- Documentation in collection descriptions

The collection provides complete API coverage for testing all Nauttec platform functionality with organized workflows and comprehensive documentation.