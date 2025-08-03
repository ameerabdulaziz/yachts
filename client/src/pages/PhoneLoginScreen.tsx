import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Anchor, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PhoneLoginScreen() {
  const [, setLocation] = useLocation();
  const [countryCode, setCountryCode] = useState("+33");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: { phone: string }) => {
      const response = await apiRequest("POST", "/api/auth/phone-login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
      setLocation(`/verify-otp?phone=${countryCode}${phoneNumber}`);
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  const handleLogin = () => {
    const fullPhone = `${countryCode}${phoneNumber}`;
    loginMutation.mutate({ phone: fullPhone });
  };

  return (
    <div className="min-h-screen bg-gradient-ocean flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Nauttec</CardTitle>
          <p className="text-gray-600">Enter your phone number to continue</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Country Code</label>
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+33">🇫🇷 +33 (France)</SelectItem>
                <SelectItem value="+34">🇪🇸 +34 (Spain)</SelectItem>
                <SelectItem value="+39">🇮🇹 +39 (Italy)</SelectItem>
                <SelectItem value="+1">🇺🇸 +1 (USA)</SelectItem>
                <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="tel"
                placeholder="123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <Button 
            onClick={handleLogin}
            disabled={!phoneNumber || loginMutation.isPending}
            className="w-full h-12 bg-primary hover:bg-primary-hover font-semibold"
          >
            {loginMutation.isPending ? "Sending..." : "Send Verification Code"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12">
              <i className="fab fa-google mr-2"></i>
              Google
            </Button>
            <Button variant="outline" className="h-12">
              <i className="fab fa-facebook mr-2"></i>
              Facebook
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
