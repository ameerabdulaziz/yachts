"""
Twilio OTP Authentication Service
Task 1 - OTP Auth (Twilio Verify) implementation
"""
import os
from twilio.rest import Client
from twilio.base.exceptions import TwilioException
from django.conf import settings
from .models import OTPVerification
import logging

logger = logging.getLogger(__name__)

class TwilioOTPService:
    """Handle Twilio Verify service for OTP authentication"""
    
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN') 
        self.verify_service_sid = os.getenv('TWILIO_VERIFY_SERVICE_SID')
        
        if not all([self.account_sid, self.auth_token, self.verify_service_sid]):
            logger.warning("Twilio credentials not configured. OTP service will use demo mode.")
            self.client = None
        else:
            self.client = Client(self.account_sid, self.auth_token)
    
    def send_otp(self, phone_number):
        """
        Send OTP to phone number via Twilio Verify
        Returns: (success: bool, message: str, verification_sid: str)
        """
        try:
            if not self.client:
                # Demo mode - generate fake verification
                otp_record = OTPVerification.objects.create(
                    phone=phone_number,
                    code="123456",  # Demo code
                    verification_sid="demo_verification"
                )
                return True, "Demo OTP sent successfully. Use code: 123456", "demo_verification"
            
            # Production Twilio Verify
            verification = self.client.verify \
                .v2 \
                .services(self.verify_service_sid) \
                .verifications \
                .create(to=phone_number, channel='sms')
            
            # Store verification record
            otp_record = OTPVerification.objects.create(
                phone=phone_number,
                verification_sid=verification.sid
            )
            
            logger.info(f"OTP sent to {phone_number}, SID: {verification.sid}")
            return True, "OTP sent successfully", verification.sid
            
        except TwilioException as e:
            logger.error(f"Twilio error sending OTP to {phone_number}: {e}")
            return False, f"Failed to send OTP: {str(e)}", None
        except Exception as e:
            logger.error(f"Unexpected error sending OTP to {phone_number}: {e}")
            return False, "Failed to send OTP", None
    
    def verify_otp(self, phone_number, code):
        """
        Verify OTP code via Twilio Verify
        Returns: (success: bool, message: str)
        """
        try:
            if not self.client:
                # Demo mode verification
                otp_record = OTPVerification.objects.filter(
                    phone=phone_number,
                    code=code,
                    is_verified=False
                ).first()
                
                if otp_record and code == "123456":
                    otp_record.is_verified = True
                    otp_record.save()
                    return True, "OTP verified successfully (demo mode)"
                else:
                    return False, "Invalid OTP code"
            
            # Production Twilio Verify
            verification_check = self.client.verify \
                .v2 \
                .services(self.verify_service_sid) \
                .verification_checks \
                .create(to=phone_number, code=code)
            
            if verification_check.status == 'approved':
                # Update verification record
                otp_record = OTPVerification.objects.filter(
                    phone=phone_number,
                    is_verified=False
                ).first()
                if otp_record:
                    otp_record.is_verified = True
                    otp_record.code = code
                    otp_record.save()
                
                logger.info(f"OTP verified for {phone_number}")
                return True, "OTP verified successfully"
            else:
                logger.warning(f"OTP verification failed for {phone_number}: {verification_check.status}")
                return False, "Invalid OTP code"
                
        except TwilioException as e:
            logger.error(f"Twilio error verifying OTP for {phone_number}: {e}")
            return False, f"Verification failed: {str(e)}"
        except Exception as e:
            logger.error(f"Unexpected error verifying OTP for {phone_number}: {e}")
            return False, "Verification failed"

# Global instance
twilio_otp_service = TwilioOTPService()