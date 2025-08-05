import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, Ship, Anchor } from "lucide-react";
import nauttecLogo from "@assets/Nauttec Logo_1754330395988.png";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AccountSetupScreen() {
  const [, setLocation] = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("renter");
  const { toast } = useToast();

  const setupMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string; role: string }) => {
      const response = await apiRequest("POST", "/api/auth/setup-account", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Setup Complete",
        description: "Welcome to Nauttec!",
      });
      setLocation("/home");
    },
    onError: () => {
      toast({
        title: "Setup Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  const handleSetup = () => {
    if (firstName && lastName && email) {
      setupMutation.mutate({ firstName, lastName, email, role });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Turquoise Sea Background */}
      <div className="absolute inset-0 bg-gradient-ocean">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 to-blue-500/40" />
      </div>
      <div className="relative z-10 w-full max-w-md">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center p-2">
            <img src={nauttecLogo} alt="Nauttec Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <p className="text-gray-600">Tell us a bit about yourself</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>I'm interested in</Label>
            <RadioGroup value={role} onValueChange={setRole}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="renter" id="renter" />
                <User className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="renter" className="font-medium">Renting Yachts</Label>
                  <p className="text-sm text-gray-600">Book luxury yacht experiences</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="owner" id="owner" />
                <Ship className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="owner" className="font-medium">Yacht Ownership</Label>
                  <p className="text-sm text-gray-600">List your yacht or invest in shares</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="both" id="both" />
                <Anchor className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="both" className="font-medium">Both</Label>
                  <p className="text-sm text-gray-600">Rent yachts and explore ownership</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Button 
            onClick={handleSetup}
            disabled={!firstName || !lastName || !email || setupMutation.isPending}
            className="w-full h-12 bg-primary hover:bg-primary-hover font-semibold"
          >
            {setupMutation.isPending ? "Setting up..." : "Complete Setup"}
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
