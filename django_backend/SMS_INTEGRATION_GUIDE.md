# SMS Integration Guide - Third-Party OTP Services

## Current Status: Demo Mode

The Django backend is currently running in **demo mode** for OTP verification:

```python
# Demo mode - create OTP record (Task 1 implementation)
otp_record = OTPVerification.objects.create(
    phone=cleaned_phone,
    code="123456",  # Demo code as specified in task board
    verification_sid="demo_verification"
)
```

**No actual SMS is sent** - the system accepts the hardcoded demo OTP code `123456` for all phone numbers.

## Recommended Third-Party SMS Services

### 1. **Twilio** (Most Popular)
- **Pricing**: $0.0075 per SMS for US/Canada, varies by country
- **Features**: Global reach, delivery reports, phone verification API
- **Python SDK**: `pip install twilio`

```python
from twilio.rest import Client

client = Client(account_sid, auth_token)
message = client.messages.create(
    body=f"Your Nauttec verification code is: {otp_code}",
    from_='+1234567890',  # Your Twilio number
    to=phone_number
)
```

### 2. **AWS SNS** (Amazon)
- **Pricing**: $0.00645 per SMS for US, varies globally
- **Features**: High reliability, integrated with AWS ecosystem
- **Python SDK**: `pip install boto3`

```python
import boto3

sns = boto3.client('sns')
response = sns.publish(
    PhoneNumber=phone_number,
    Message=f"Your Nauttec verification code is: {otp_code}"
)
```

### 3. **MessageBird**
- **Pricing**: €0.045 per SMS for most countries
- **Features**: Global coverage, conversation API
- **Python SDK**: `pip install messagebird`

```python
import messagebird

client = messagebird.Client('your-access-key')
message = client.message_create(
    'Nauttec',  # Originator
    [phone_number],  # Recipients
    f"Your verification code is: {otp_code}"
)
```

### 4. **Vonage (formerly Nexmo)**
- **Pricing**: €0.0331 per SMS for most regions
- **Features**: Two-way messaging, delivery receipts
- **Python SDK**: `pip install vonage`

```python
import vonage

client = vonage.Client(key="your-key", secret="your-secret")
sms = vonage.Sms(client)

response = sms.send_message({
    "from": "Nauttec",
    "to": phone_number,
    "text": f"Your verification code is: {otp_code}",
})
```

## Implementation Steps

### 1. Choose Provider and Get Credentials
- Sign up for chosen service (Twilio recommended)
- Get API credentials (Account SID, Auth Token, etc.)
- Purchase a phone number if required

### 2. Install SDK
```bash
pip install twilio  # or your chosen provider
```

### 3. Update Django Settings
```python
# settings.py
SMS_PROVIDER = 'twilio'  # or 'aws_sns', 'messagebird', etc.
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
```

### 4. Create SMS Service
```python
# accounts/sms_service.py
import random
from django.conf import settings
from twilio.rest import Client

class SMSService:
    def __init__(self):
        self.client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )
    
    def send_otp(self, phone_number):
        otp_code = str(random.randint(100000, 999999))
        
        message = self.client.messages.create(
            body=f"Your Nauttec verification code is: {otp_code}",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        
        return otp_code, message.sid
```

### 5. Update Views
```python
# accounts/views_task1.py
from .sms_service import SMSService

def send_otp(request):
    # ... existing code ...
    
    if settings.DEBUG:
        # Demo mode for development
        otp_code = "123456"
        verification_sid = "demo_verification"
    else:
        # Production mode - send real SMS
        sms_service = SMSService()
        otp_code, verification_sid = sms_service.send_otp(cleaned_phone)
    
    otp_record = OTPVerification.objects.create(
        phone=cleaned_phone,
        code=otp_code,
        verification_sid=verification_sid
    )
```

## Security Considerations

### Rate Limiting
```python
from django.core.cache import cache

def send_otp(request):
    cache_key = f"otp_attempts_{cleaned_phone}"
    attempts = cache.get(cache_key, 0)
    
    if attempts >= 3:
        return JsonResponse({
            'success': False,
            'message': 'Too many attempts. Try again later.'
        }, status=429)
    
    cache.set(cache_key, attempts + 1, 300)  # 5 minutes
```

### OTP Expiration
```python
from django.utils import timezone
from datetime import timedelta

# In OTP verification
if otp_record.created_at < timezone.now() - timedelta(minutes=5):
    return JsonResponse({
        'success': False,
        'message': 'OTP has expired'
    }, status=400)
```

## Cost Estimation

For a yacht platform with moderate usage:
- **100 OTPs/day**: ~$23/month (Twilio)
- **500 OTPs/day**: ~$115/month (Twilio)
- **1000 OTPs/day**: ~$230/month (Twilio)

## Recommendation

**Start with Twilio** for production implementation:
1. Most reliable and widely used
2. Excellent documentation and Python SDK
3. Good international coverage
4. Reasonable pricing for yacht platform audience
5. Easy to implement phone number verification

The current demo mode is perfect for development and testing, but you'll need to integrate a real SMS service before production deployment.