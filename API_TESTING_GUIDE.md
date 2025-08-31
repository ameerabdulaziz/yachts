# Nauttec API Testing Guide

## Quick Start

### 1. Import Postman Collection
1. Open Postman
2. Click "Import" 
3. Select `nauttec_postman_collection.json`
4. Collection includes 34 endpoints across 9 areas

### 2. Configure Environment
Set these variables in Postman:
- `base_url`: `http://localhost:8000` (development) or your production URL
- `user_phone`: `+201234567890` (or any test user phone)

### 3. Authentication Flow
1. **Register User**: `POST /auth/register/`
2. **Send OTP**: `POST /auth/send-otp/`
3. **Verify OTP**: `POST /auth/verify-otp/`
4. **Set Password**: `POST /auth/set-password/`
5. **Login**: `POST /auth/login/`

## API Endpoints Overview

### Authentication (5 endpoints)
- User registration and phone verification
- OTP-based authentication
- Password management
- Session-based login

### Yacht Fleet (3 endpoints)
- List yachts with filtering
- Yacht details and specifications
- Availability checking

### Bookings (4 endpoints)
- Create and manage bookings
- Booking history and details
- Cancellation handling
- Status tracking

### Ownership (4 endpoints)
- Fractional ownership management
- Share transactions
- Ownership details
- Share marketplace

### Fuel Wallet (4 endpoints)
- Wallet balance management
- Fuel credit purchases
- Transaction history
- Auto-top-up settings

### Payments (4 endpoints)
- Payment intent creation
- Payment confirmation
- Payment history
- Stripe integration

### Inquiries (3 endpoints)
- Lead capture
- Inquiry management
- Lead scoring system

### Notifications (4 endpoints)
- Notification feed
- Mark as read
- Test notifications
- User preferences

### Health & Testing (3 endpoints)
- System health checks
- Database monitoring
- Comprehensive testing

## Testing Scenarios

### Complete User Journey
1. **New User Registration**
   ```
   POST /auth/register/
   Body: {"phone": "+1234567890", "role": "renter"}
   ```

2. **Phone Verification**
   ```
   POST /auth/send-otp/
   Body: {"phone": "+1234567890"}
   
   POST /auth/verify-otp/
   Body: {"phone": "+1234567890", "otp_code": "123456"}
   ```

3. **Browse Yachts**
   ```
   GET /boats/?location=Monaco&capacity_min=8
   ```

4. **Create Booking**
   ```
   POST /bookings/
   Body: {
     "user_phone": "+1234567890",
     "boat_id": 1,
     "start_date": "2025-09-15",
     "end_date": "2025-09-17",
     "guest_count": 6
   }
   ```

5. **Process Payment**
   ```
   POST /payment-intents/
   Body: {
     "user_phone": "+1234567890",
     "amount": "2400.00",
     "currency": "USD"
   }
   ```

### Owner Journey
1. **View Owned Yachts**
   ```
   GET /ownership/?user_phone=+33123456789
   ```

2. **Check Fuel Wallet**
   ```
   GET /fuel-wallet/?user_phone=+33123456789
   ```

3. **Top Up Fuel**
   ```
   POST /fuel-wallet/purchase/
   Body: {
     "user_phone": "+33123456789",
     "amount": "500.00"
   }
   ```

### Admin/Staff Journey
1. **Review Inquiries**
   ```
   GET /inquiries/list/?status=new&qualified_only=true
   ```

2. **Check System Health**
   ```
   GET /health/
   GET /health/database/
   ```

3. **Run System Tests**
   ```
   POST /health/test-systems/
   Body: {"run_comprehensive_tests": true}
   ```

## Response Formats

### Success Response
```json
{
  "status": "success",
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "error": "Error description",
  "details": {...}
}
```

### Pagination
```json
{
  "results": [...],
  "count": 25,
  "next": "http://api.example.com/endpoint/?page=2",
  "previous": null
}
```

## Common Test Data

### Test Users
- `+201234567890` - Ahmed Hassan (renter)
- `+33123456789` - Pierre Dubois (owner)
- `+34987654321` - Isabella Rodriguez (owner)
- `+447123456789` - James Thompson (renter)

### Test Yachts
- ID 1: D29 Mediterranean Dream (€1,200/day)
- ID 2: D33 Adriatic Explorer (€1,800/day)
- ID 3: D42 Balearic Beauty (€2,800/day)
- ID 4: D50 Aegean Voyager (€4,200/day)
- ID 5: D60 Riviera Prestige (€6,500/day)

## Error Handling

### Common Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - System error

### Validation Errors
```json
{
  "status": "error",
  "error": "Validation failed",
  "details": {
    "phone": ["This field is required"],
    "guest_count": ["Must be between 1 and yacht capacity"]
  }
}
```

## Performance Testing

### Load Testing Endpoints
- `GET /boats/` - High read volume
- `POST /bookings/` - Critical business operation
- `GET /health/` - Monitoring endpoint

### Expected Response Times
- Health checks: < 100ms
- Yacht listings: < 500ms
- Booking creation: < 1000ms
- Payment processing: < 2000ms

## Security Testing

### Authentication Tests
- Invalid phone numbers
- Expired OTP codes
- Unauthorized access attempts
- Session timeout handling

### Input Validation
- SQL injection attempts
- XSS payload testing
- Invalid date ranges
- Negative amounts

## Monitoring

### Key Metrics
- API response times
- Error rates by endpoint
- Authentication success rates
- Booking conversion rates
- Payment success rates

### Health Check Monitoring
Set up monitoring for:
- `GET /health/` every 30 seconds
- `GET /health/database/` every 5 minutes
- `POST /health/test-systems/` every hour

## Troubleshooting

### Common Issues
1. **Authentication Failures**
   - Check phone number format
   - Verify OTP is not expired
   - Ensure user exists

2. **Booking Conflicts**
   - Check yacht availability
   - Verify date ranges
   - Confirm guest count limits

3. **Payment Issues**
   - Verify Stripe configuration
   - Check payment intent status
   - Validate amount format

### Debug Tips
- Enable Django debug mode for detailed errors
- Check server logs for backend issues
- Use health endpoints to verify system status
- Test with known good data first