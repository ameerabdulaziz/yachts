import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, TrendingUp, Euro, Calendar, Info, Upload, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ListShareForSaleScreen() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    yachtId: "",
    shareFraction: "",
    sharesForSale: 1,
    askingPrice: "",
    originalPrice: "",
    reason: "",
    description: "",
    flexiblePricing: false,
    urgentSale: false,
    contactPreference: "messages",
    agreeToTerms: false
  });

  // Mock user's yacht shares
  const userShares = [
    {
      id: "share-1",
      yacht: { name: "Azure Legend", location: "French Riviera" },
      shareFraction: "1/8",
      originalPrice: 45000,
      currentValue: 48000
    },
    {
      id: "share-2",
      yacht: { name: "Wind Dancer", location: "Greek Islands" },
      shareFraction: "1/6",
      originalPrice: 32000,
      currentValue: 35000
    }
  ];

  const listingMutation = useMutation({
    mutationFn: async (listingData: any) => {
      const response = await apiRequest("POST", "/api/share-listings", listingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Share Listed Successfully!",
        description: "Your yacht share is now available on the marketplace.",
      });
      setLocation("/share-marketplace");
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
    if (!formData.yachtId || !formData.askingPrice || !formData.agreeToTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and agree to terms.",
        variant: "destructive",
      });
      return;
    }

    const listingData = {
      sharePurchaseId: formData.yachtId, // In real app, would map to actual share purchase
      sellerId: "user-1",
      askingPrice: formData.askingPrice,
      sharesForSale: formData.sharesForSale,
      status: "active"
    };
    
    listingMutation.mutate(listingData);
  };

  const selectedShare = userShares.find(share => share.id === formData.yachtId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link href="/share-marketplace">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">List Share for Sale</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-ocean px-4 py-8 text-white">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold mb-2">Sell Your Yacht Share</h2>
          <p className="text-blue-100">Reach qualified buyers in our marketplace</p>
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Share Selection */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Share to Sell</h3>
            <div className="space-y-3">
              {userShares.map((share) => (
                <div 
                  key={share.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.yachtId === share.id ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, yachtId: share.id})}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={formData.yachtId === share.id}
                      onChange={() => setFormData({...formData, yachtId: share.id})}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{share.yacht.name}</h4>
                      <p className="text-sm text-gray-600">{share.yacht.location} • {share.shareFraction} share</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Original: €{share.originalPrice.toLocaleString()}</span>
                        <span className="text-green-600">Current: €{share.currentValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="askingPrice">Asking Price *</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="askingPrice"
                    type="number"
                    value={formData.askingPrice}
                    onChange={(e) => setFormData({...formData, askingPrice: e.target.value})}
                    placeholder="48000"
                    className="pl-10"
                  />
                </div>
                {selectedShare && (
                  <p className="text-sm text-gray-600 mt-1">
                    Current market estimate: €{selectedShare.currentValue.toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="originalPrice">Original Purchase Price</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    placeholder="45000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flexible"
                    checked={formData.flexiblePricing}
                    onCheckedChange={(checked) => setFormData({...formData, flexiblePricing: !!checked})}
                  />
                  <Label htmlFor="flexible">Open to price negotiations</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={formData.urgentSale}
                    onCheckedChange={(checked) => setFormData({...formData, urgentSale: !!checked})}
                  />
                  <Label htmlFor="urgent">Urgent sale (willing to accept lower offers)</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reason for Sale */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reason for Sale</h3>
            <RadioGroup value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upgrading" id="upgrading" />
                <Label htmlFor="upgrading">Upgrading to larger share</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="relocating" id="relocating" />
                <Label htmlFor="relocating">Relocating/Moving abroad</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="financial" id="financial" />
                <Label htmlFor="financial">Financial reasons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lifestyle" id="lifestyle" />
                <Label htmlFor="lifestyle">Lifestyle change</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Description</h3>
            <div>
              <Label htmlFor="description">Tell potential buyers about your experience</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your experience with this yacht share, usage patterns, and why you're selling..."
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Include details about yacht condition, management quality, and your usage experience
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Preferences */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Preferences</h3>
            <RadioGroup value={formData.contactPreference} onValueChange={(value) => setFormData({...formData, contactPreference: value})}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="messages" id="messages" />
                <Label htmlFor="messages">Nauttec messages only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone">Phone calls preferred</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email communication</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Listing Preview */}
        {selectedShare && formData.askingPrice && (
          <Card>
            <CardContent className="p-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Preview</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Yacht</span>
                  <span className="font-medium">{selectedShare.yacht.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Share</span>
                  <span className="font-medium">{selectedShare.shareFraction}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Asking Price</span>
                  <span className="font-medium">€{Number(formData.askingPrice).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Market Comparison</span>
                  <span className={`font-medium ${
                    Number(formData.askingPrice) > selectedShare.currentValue ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {((Number(formData.askingPrice) - selectedShare.currentValue) / selectedShare.currentValue * 100).toFixed(1)}% vs market
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fees Information */}
        <Card>
          <CardContent className="p-4 bg-amber-50">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Listing Fees & Charges</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Marketplace listing fee: 2% of sale price</li>
                  <li>• Transfer documentation fee: €500</li>
                  <li>• Legal review and approval: €750</li>
                  <li>• Total estimated fees: ~3% of sale price</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Submit */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: !!checked})}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the marketplace terms, listing fees, and authorize Nauttec to facilitate the sale *
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={listingMutation.isPending || !formData.agreeToTerms}
          className="w-full bg-gradient-ocean text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
        >
          {listingMutation.isPending ? "Creating Listing..." : "List Share for Sale"}
        </Button>

        <p className="text-xs text-gray-600 text-center">
          Your listing will be reviewed and published within 24 hours
        </p>
      </div>
    </div>
  );
}
