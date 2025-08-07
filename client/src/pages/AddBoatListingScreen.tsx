import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Ship, MapPin, Euro, Users, Upload, Plus, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import seaBackground from "@assets/image_1754575606863.png";

export default function AddBoatListingScreen() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    pricePerDay: "",
    capacity: "",
    cabins: "",
    length: "",
    yearBuilt: "",
    amenities: [] as string[],
    images: [] as string[],
    isActive: true
  });

  const availableAmenities = [
    "WiFi", "Kitchen", "Swimming platform", "Sound system", "Air conditioning", 
    "Jacuzzi", "Water sports equipment", "Fishing gear", "Bar", "BBQ Grill"
  ];

  const yachtMutation = useMutation({
    mutationFn: async (yachtData: any) => {
      const response = await apiRequest("POST", "/api/yachts", yachtData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Yacht Listed Successfully!",
        description: "Your yacht is now available for booking.",
      });
      setLocation("/owner-dashboard");
    },
    onError: () => {
      toast({
        title: "Listing Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.location || !formData.pricePerDay || !formData.capacity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const yachtData = {
      ...formData,
      ownerId: "user-1", // In real app, get from auth context
      pricePerDay: formData.pricePerDay,
      capacity: parseInt(formData.capacity),
      cabins: parseInt(formData.cabins),
      length: formData.length ? parseFloat(formData.length) : null,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null
    };
    
    yachtMutation.mutate(yachtData);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link href="/owner-dashboard">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Add Yacht Listing</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-8 overflow-hidden">
        {/* Turquoise Sea Background */}
        <div className="absolute inset-0 bg-gradient-ocean">
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${seaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-blue-200/20 to-blue-500/30" />
        </div>
        
        <div className="relative z-10">
          <div className="bg-white rounded-2xl p-6 mx-4 shadow-xl text-center">
            <Ship className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">List Your Yacht</h2>
            <p className="text-gray-600">Start earning from your yacht today</p>
          </div>
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Ship className="w-5 h-5 inline mr-2" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Yacht Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Serenity Princess"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your yacht's unique features and amenities..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
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

        {/* Specifications */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Guest Capacity *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="12"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cabins">Number of Cabins</Label>
                <Input
                  id="cabins"
                  type="number"
                  value={formData.cabins}
                  onChange={(e) => setFormData({...formData, cabins: e.target.value})}
                  placeholder="6"
                />
              </div>
              
              <div>
                <Label htmlFor="length">Length (feet)</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({...formData, length: e.target.value})}
                  placeholder="78"
                />
              </div>
              
              <div>
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({...formData, yearBuilt: e.target.value})}
                  placeholder="2019"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Euro className="w-5 h-5 inline mr-2" />
              Pricing
            </h3>
            <div>
              <Label htmlFor="pricePerDay">Price per Day (EUR) *</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="pricePerDay"
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                  placeholder="2400"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Set a competitive daily rate for your yacht
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                </div>
              ))}
            </div>
            
            {formData.amenities.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      <span>{amenity}</span>
                      <button onClick={() => toggleAmenity(amenity)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload yacht photos</p>
              <p className="text-sm text-gray-500 mb-4">
                High-quality photos increase booking rates by 40%
              </p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Photos
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Exterior views, interior spaces, amenities. Maximum 10 photos.
            </p>
          </CardContent>
        </Card>

        {/* Listing Preview */}
        {formData.name && formData.pricePerDay && (
          <Card>
            <CardContent className="p-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Preview</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Yacht Name</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Location</span>
                  <span className="font-medium">{formData.location || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Daily Rate</span>
                  <span className="font-medium">€{Number(formData.pricePerDay).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Capacity</span>
                  <span className="font-medium">{formData.capacity} guests</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={yachtMutation.isPending}
          className="w-full bg-gradient-ocean text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
        >
          {yachtMutation.isPending ? "Creating Listing..." : "List Your Yacht"}
        </Button>

        <p className="text-xs text-gray-600 text-center">
          Your listing will be reviewed and published within 24 hours
        </p>
      </div>
    </div>
  );
}
