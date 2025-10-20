import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import saxdorLogo from "@assets/image_1760971559327.png";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function PhoneLoginScreen() {
  const [, setLocation] = useLocation();
  const [countryCode, setCountryCode] = useState("+34");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState("password"); // "password" or "otp"
  const { toast } = useToast();

  const passwordLoginMutation = useMutation({
    mutationFn: async (data: { phone: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      // Redirect based on user role
      if (data.user?.role === "owner") {
        setLocation("/my-boats");
      } else {
        setLocation("/home");
      }
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid phone number or password",
        variant: "destructive",
      });
    }
  });

  const otpLoginMutation = useMutation({
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

  const handlePasswordLogin = () => {
    const fullPhone = `${countryCode}${phoneNumber}`;
    passwordLoginMutation.mutate({ phone: fullPhone, password });
  };

  const handleOtpLogin = () => {
    const fullPhone = `${countryCode}${phoneNumber}`;
    otpLoginMutation.mutate({ phone: fullPhone });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="text-center">
          <div className="w-48 h-16 mx-auto mb-8">
            <img src={saxdorLogo} alt="Saxdor Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Welcome aboard!</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Enter your phone number to get started<br />
            with premium yacht experiences
          </p>
        </div>

        {/* Login Section */}
        <Card className="w-full">
          <CardContent className="p-6">
            <Tabs value={loginMode} onValueChange={setLoginMode}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="password">Login</TabsTrigger>
                <TabsTrigger value="otp">Signup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="password" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex space-x-0 border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-28 border-0 bg-gray-50 rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+33">🇫🇷 +33</SelectItem>
                        <SelectItem value="+49">🇩🇪 +49</SelectItem>
                        <SelectItem value="+39">🇮🇹 +39</SelectItem>
                        <SelectItem value="+34">🇪🇸 +34</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 border-0 rounded-none focus-visible:ring-0 text-base"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-base"
                  />
                </div>

                <Button 
                  onClick={handlePasswordLogin} 
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white py-4 text-base font-medium rounded-lg"
                  disabled={passwordLoginMutation.isPending || !phoneNumber || !password}
                >
                  {passwordLoginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </TabsContent>
              
              <TabsContent value="otp" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-otp">Phone Number</Label>
                  <div className="flex space-x-0 border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-28 border-0 bg-gray-50 rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+33">🇫🇷 +33</SelectItem>
                        <SelectItem value="+49">🇩🇪 +49</SelectItem>
                        <SelectItem value="+39">🇮🇹 +39</SelectItem>
                        <SelectItem value="+34">🇪🇸 +34</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone-otp"
                      type="tel"
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 border-0 rounded-none focus-visible:ring-0 text-base"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleOtpLogin} 
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white py-4 text-base font-medium rounded-lg"
                  disabled={otpLoginMutation.isPending || !phoneNumber}
                >
                  {otpLoginMutation.isPending ? "Sending..." : "Send Verification Code"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Social Login Section */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-gray-500">Or continue with</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="py-4 text-base font-medium border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-105"
              onClick={() => {
                toast({
                  title: "Google Login",
                  description: "Redirecting to Google authentication...",
                });
                // Simulate Google login flow
                setTimeout(() => {
                  toast({
                    title: "Login Successful",
                    description: "Welcome back!",
                  });
                  setLocation("/home");
                }, 2000);
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            
            <Button 
              variant="outline" 
              className="py-4 text-base font-medium border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-105"
              onClick={() => {
                toast({
                  title: "Facebook Login",
                  description: "Redirecting to Facebook authentication...",
                });
                // Simulate Facebook login flow
                setTimeout(() => {
                  toast({
                    title: "Login Successful",
                    description: "Welcome back!",
                  });
                  setLocation("/home");
                }, 2000);
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </div>

        {/* Terms Section */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <span className="text-blue-500">Terms of Service</span> and{" "}
            <span className="text-blue-500">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
