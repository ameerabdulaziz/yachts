import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";
import seaBackground from "@assets/image_1754575606863.png";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/admin/auth/login", credentials);
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.firstName} ${data.user.lastName}`,
      });
      setLocation("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4" style={{ minWidth: '1024px' }}>
      {/* Ocean Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url(${seaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-blue-100/40 to-blue-200/60" />
      </div>

      <Card className="relative w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl" data-testid="admin-login-card">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <img src={deAntonioLogo} alt="De Antonio Yachts" className="h-12 w-auto mx-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900" data-testid="text-admin-login-title">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to manage dealers, boats and inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-white border-gray-200"
                data-testid="input-username"
                disabled={loginMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-white border-gray-200"
                data-testid="input-password"
                disabled={loginMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Default credentials for testing:
            </p>
            <p className="text-center text-sm font-medium text-gray-700 mt-1">
              admin / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
