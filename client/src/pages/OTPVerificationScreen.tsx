import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Shield, RotateCcw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function OTPVerificationScreen() {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(12);
  const { toast } = useToast();
  
  // Get phone from URL params
  const phone = new URLSearchParams(window.location.search).get("phone") || "+1 (234) 567-890";

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const verifyMutation = useMutation({
    mutationFn: async (data: { phone: string; otp: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.user) {
        toast({
          title: "Verification Successful",
          description: "Welcome to Nauttec!",
        });
        setLocation("/account-setup");
      }
    },
    onError: () => {
      toast({
        title: "Invalid Code",
        description: "Please check your code and try again",
        variant: "destructive",
      });
    }
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      verifyMutation.mutate({ phone, otp: otpCode });
    }
  };

  const resendCode = () => {
    setResendTimer(12);
    toast({
      title: "Code Resent",
      description: "A new verification code has been sent to your phone",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Verification</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Shield Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-blue-400 rounded-3xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Enter verification code</h2>
            <div className="space-y-2">
              <p className="text-gray-600">We sent a 6-digit code to</p>
              <p className="font-semibold text-gray-900">{phone}</p>
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e.nativeEvent)}
                className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl focus:border-blue-400"
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button 
            onClick={handleVerify}
            disabled={otp.join("").length !== 6 || verifyMutation.isPending}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-4 text-base font-medium rounded-lg"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify Code"}
          </Button>

          {/* Resend Section */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">Didn't receive the code?</p>
            
            {resendTimer > 0 ? (
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <RotateCcw className="w-4 h-4" />
                <span>Resend in {resendTimer}s</span>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={resendCode}
                className="text-blue-500 hover:text-blue-600"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resend Code
              </Button>
            )}
          </div>

          {/* Demo Tip */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              💡 <strong>Demo tip:</strong> Use code <strong>123456</strong> to proceed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
