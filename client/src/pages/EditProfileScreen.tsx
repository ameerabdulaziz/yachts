import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EditProfileScreen() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Mock current user data - in real app this would come from auth context
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+33 123 456 789",
    location: "Monaco",
    role: "both",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: typeof formData) => {
      const response = await apiRequest("PUT", "/api/auth/profile", profileData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setLocation("/profile");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
          </div>
          <Button 
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="bg-primary text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            {updateProfileMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Photo */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.profileImageUrl} alt="Profile" />
                <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-white hover:bg-primary-hover p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile Photo</h3>
            <p className="text-sm text-gray-600 mb-4">Update your profile picture</p>
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <User className="w-5 h-5 inline mr-2" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+33 1 23 45 67 89"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Monaco, France"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">I'm interested in</Label>
                <RadioGroup value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
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
                    <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="owner" className="font-medium">Yacht Ownership</Label>
                      <p className="text-sm text-gray-600">List your yacht or invest in shares</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="both" id="both" />
                    <div className="w-5 h-5 bg-gradient-ocean rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="both" className="font-medium">Both</Label>
                      <p className="text-sm text-gray-600">Rent yachts and explore ownership</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12">
                <Mail className="w-5 h-5 mr-3" />
                Change Email Address
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Phone className="w-5 h-5 mr-3" />
                Update Phone Number
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 text-red-600 border-red-200 hover:bg-red-50">
                <div className="w-5 h-5 mr-3 bg-red-600 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded"></div>
                </div>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
