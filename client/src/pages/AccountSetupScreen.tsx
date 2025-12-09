import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Ship, Anchor, TrendingUp, Users, DollarSign, MapPin } from "lucide-react";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const EUROPEAN_COUNTRIES = [
  "Spain", "France", "Italy", "Croatia", "Greece", "Monaco", "Portugal", 
  "Germany", "Netherlands", "United Kingdom", "Switzerland", "Belgium",
  "Austria", "Sweden", "Norway", "Denmark", "Poland", "Turkey", "Malta", "Cyprus"
];

const MODALITIES = [
  { value: "OWN", label: "Full Ownership", description: "100% ownership with financing options", icon: Ship },
  { value: "EARN", label: "Charter & Earn", description: "Own and earn from charter revenue", icon: TrendingUp },
  { value: "CO_OWN", label: "Co-Ownership", description: "Fractional ownership with shared usage", icon: Users },
  { value: "INVEST", label: "Investment", description: "Pure investment for returns", icon: DollarSign },
];

export default function AccountSetupScreen() {
  const [, setLocation] = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("renter");
  const [countryOfBerth, setCountryOfBerth] = useState("");
  const [cityOfBerth, setCityOfBerth] = useState("");
  const [interestedModality, setInterestedModality] = useState("");
  const { toast } = useToast();

  const setupMutation = useMutation({
    mutationFn: async (data: { 
      firstName: string; 
      lastName: string; 
      email: string; 
      password: string; 
      role: string;
      countryOfBerth: string;
      cityOfBerth: string;
      interestedModality: string;
    }) => {
      const response = await apiRequest("POST", "/api/auth/setup-account", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Setup Complete",
        description: "Welcome to Nauttec!",
      });
      if (role === "owner") {
        setLocation("/my-boats");
      } else {
        setLocation("/home");
      }
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
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Modality selection is mandatory for lead segmentation
    if (!interestedModality) {
      toast({
        title: "Modality Required",
        description: "Please select how you'd like to access yacht ownership",
        variant: "destructive",
      });
      return;
    }
    
    if (firstName && lastName && email && password) {
      setupMutation.mutate({ 
        firstName, 
        lastName, 
        email, 
        password, 
        role,
        countryOfBerth,
        cityOfBerth,
        interestedModality
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-ocean">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 to-blue-500/40" />
      </div>
      <div className="relative z-10 w-full max-w-lg">
      <Card className="w-full">
        <CardHeader className="text-center pb-4">
          <div className="w-18 h-[57px] mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center p-2">
            <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <p className="text-gray-600">Tell us about yourself and your yacht interests</p>
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
                data-testid="input-firstName"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                data-testid="input-lastName"
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
              data-testid="input-email"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                data-testid="input-confirmPassword"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Country of Boat Berth
              </Label>
              <Select value={countryOfBerth} onValueChange={setCountryOfBerth}>
                <SelectTrigger data-testid="select-country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {EUROPEAN_COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cityOfBerth">City / Marina</Label>
              <Input
                id="cityOfBerth"
                placeholder="e.g. Barcelona, Nice"
                value={cityOfBerth}
                onChange={(e) => setCityOfBerth(e.target.value)}
                data-testid="input-cityOfBerth"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>I'm primarily interested in</Label>
            <RadioGroup value={role} onValueChange={setRole}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="owner" id="owner" data-testid="radio-owner" />
                <Ship className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="owner" className="font-medium cursor-pointer">Own a yacht</Label>
                  <p className="text-sm text-gray-600">Buy with friends or with others</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="renter" id="renter" data-testid="radio-renter" />
                <User className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="renter" className="font-medium cursor-pointer">Rent a yacht</Label>
                  <p className="text-sm text-gray-600">Book luxury yacht experiences</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="both" id="both" data-testid="radio-both" />
                <Anchor className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="both" className="font-medium cursor-pointer">Both</Label>
                  <p className="text-sm text-gray-600">Rent yachts and explore ownership</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {(role === "owner" || role === "both") && (
            <div className="space-y-3">
              <Label>Preferred Ownership Modality</Label>
              <RadioGroup value={interestedModality} onValueChange={setInterestedModality}>
                {MODALITIES.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div key={mod.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={mod.value} id={mod.value} data-testid={`radio-modality-${mod.value}`} />
                      <Icon className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <Label htmlFor={mod.value} className="font-medium cursor-pointer">{mod.label}</Label>
                        <p className="text-sm text-gray-600">{mod.description}</p>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          <Button 
            onClick={handleSetup}
            disabled={!firstName || !lastName || !email || !password || !confirmPassword || setupMutation.isPending}
            className="w-full h-12 bg-primary hover:bg-primary-hover font-semibold"
            data-testid="button-complete-setup"
          >
            {setupMutation.isPending ? "Setting up..." : "Complete Setup"}
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
