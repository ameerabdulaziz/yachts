import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Anchor } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function OTPVerificationScreen() {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  
  // Get phone from URL params
  const phone = new URLSearchParams(window.location.search).get("phone") || "";

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

  const handleVerify = () => {
    if (otp.length === 6) {
      verifyMutation.mutate({ phone, otp });
    }
  };

  const resendCode = () => {
    toast({
      title: "Code Resent",
      description: "A new verification code has been sent to your phone",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-ocean flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
          <p className="text-gray-600">
            Enter the 6-digit code sent to<br />
            <span className="font-semibold">{phone}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            onClick={handleVerify}
            disabled={otp.length !== 6 || verifyMutation.isPending}
            className="w-full h-12 bg-primary hover:bg-primary-hover font-semibold"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <Button 
              variant="ghost" 
              onClick={resendCode}
              className="text-primary hover:text-primary-hover"
            >
              Resend Code
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            For demo purposes, use code: <strong>123456</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
