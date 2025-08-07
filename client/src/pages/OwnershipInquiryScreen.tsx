import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Euro, Calendar, User, Phone, Mail, FileText } from "lucide-react";
import { mockOwnershipOpportunities } from "@/lib/mockData";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function OwnershipInquiryScreen() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const opportunity = mockOwnershipOpportunities.find(o => o.id === id) || mockOwnershipOpportunities[0];
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    investmentAmount: opportunity.sharePrice,
    sharesRequested: 1,
    investmentExperience: "",
    timeframe: "",
    financingNeeded: false,
    additionalQuestions: "",
    agreeToTerms: false,
    subscribeToUpdates: true
  });

  const sharePurchaseMutation = useMutation({
    mutationFn: async (purchaseData: any) => {
      const response = await apiRequest("POST", "/api/share-purchases", purchaseData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Investment Inquiry Submitted!",
        description: "Our team will contact you within 24 hours.",
      });
      setLocation(`/share-purchase-confirmation/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    if (!formData.firstName || !formData.email || !formData.agreeToTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and agree to terms.",
        variant: "destructive",
      });
      return;
    }

    const purchaseData = {
      opportunityId: opportunity.id,
      userId: "user-1", // In real app, get from auth context
      sharesPurchased: formData.sharesRequested,
      purchasePrice: (Number(opportunity.sharePrice) * formData.sharesRequested).toString(),
      purchaseDate: new Date()
    };
    
    sharePurchaseMutation.mutate(purchaseData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link href={`/ownership/${opportunity.id}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Investment Inquiry</h1>
        </div>
      </header>

      {/* Hero Section with Seawater Background */}
      <section className="relative px-4 py-8 overflow-hidden">
        {/* Turquoise Sea Background */}
        <div className="absolute inset-0 bg-gradient-ocean">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-blue-200/20 to-blue-500/30" />
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>{opportunity.yacht.name}</h2>
            <p className="text-gray-700" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{opportunity.shareFraction} Share Investment</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>€{Number(opportunity.sharePrice).toLocaleString()}</p>
              <p className="text-gray-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>per share</p>
            </div>
          </div>
        </div>
      </section>

      <div className="p-4 space-y-6">
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
            </div>
          </CardContent>
        </Card>

        {/* Investment Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Euro className="w-5 h-5 inline mr-2" />
              Investment Details
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Number of Shares</Label>
                <Select value={formData.sharesRequested.toString()} onValueChange={(value) => setFormData({...formData, sharesRequested: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(opportunity.availableShares)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} share{i > 0 ? 's' : ''} - €{((i + 1) * Number(opportunity.sharePrice)).toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Investment Timeframe</Label>
                <RadioGroup value={formData.timeframe} onValueChange={(value) => setFormData({...formData, timeframe: value})}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <Label htmlFor="immediate">Ready to invest immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-month" id="1-month" />
                    <Label htmlFor="1-month">Within 1 month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-months" id="3-months" />
                    <Label htmlFor="3-months">Within 3 months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="just-browsing" id="just-browsing" />
                    <Label htmlFor="just-browsing">Just browsing for now</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financing"
                  checked={formData.financingNeeded}
                  onCheckedChange={(checked) => setFormData({...formData, financingNeeded: !!checked})}
                />
                <Label htmlFor="financing">I'm interested in financing options</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <FileText className="w-5 h-5 inline mr-2" />
              Additional Information
            </h3>
            <div>
              <Label htmlFor="questions">Questions or Comments</Label>
              <Textarea
                id="questions"
                value={formData.additionalQuestions}
                onChange={(e) => setFormData({...formData, additionalQuestions: e.target.value})}
                placeholder="Any specific questions about the investment, usage schedule, or yacht specifications?"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Summary */}
        <Card>
          <CardContent className="p-4 bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Yacht</span>
                <span className="font-medium">{opportunity.yacht.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Share Fraction</span>
                <span className="font-medium">{opportunity.shareFraction}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Shares Requested</span>
                <span className="font-medium">{formData.sharesRequested}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Annual Usage</span>
                <span className="font-medium">{opportunity.usageDaysPerYear} days</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Investment</span>
                  <span className="text-xl font-bold text-primary">
                    €{(Number(opportunity.sharePrice) * formData.sharesRequested).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
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
                  I agree to the <Button variant="link" className="p-0 h-auto text-primary">Terms and Conditions</Button> and 
                  <Button variant="link" className="p-0 h-auto text-primary ml-1">Privacy Policy</Button> *
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="updates"
                  checked={formData.subscribeToUpdates}
                  onCheckedChange={(checked) => setFormData({...formData, subscribeToUpdates: !!checked})}
                />
                <Label htmlFor="updates" className="text-sm">
                  Subscribe to investment updates and yacht ownership news
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={sharePurchaseMutation.isPending || !formData.agreeToTerms}
          className="w-full bg-gradient-ocean text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
        >
          {sharePurchaseMutation.isPending ? "Submitting..." : "Submit Investment Inquiry"}
        </Button>

        <p className="text-xs text-gray-600 text-center">
          This is an inquiry only. No payment will be processed at this time. 
          Our investment team will contact you to discuss next steps.
        </p>
      </div>
    </div>
  );
}
