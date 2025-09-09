import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share, Heart, TrendingUp, Calendar, MapPin, Users, Bed, Star, Euro, PieChart, Clock, Shield, CreditCard, Cog, Fuel } from "lucide-react";
import { mockOwnershipOpportunities } from "@/lib/mockData";

export default function YachtOwnershipDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Find opportunity by ID
  const opportunity = mockOwnershipOpportunities.find(o => o.id === id) || mockOwnershipOpportunities[0];
  
  const roiData = [
    { year: 2026, value: 6 },
    { year: 2027, value: 5 },
    { year: 2028, value: 7 },
    { year: 2029, value: 8 },
    { year: 2030, value: 6 }
  ];

  const usageSchedule = [
    { month: "June", weeks: ["15-22", "29-30"] },
    { month: "July", weeks: ["6-13"] },
    { month: "August", weeks: ["17-24"] },
    { month: "September", weeks: ["14-21"] }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="flex items-center justify-between p-4">
          <Link href="/ownership-opportunities">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </Button>
          </Link>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm">
              <Heart className="w-5 h-5 text-gray-900" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => {
                const shareText = `Check out this amazing yacht ownership opportunity: ${opportunity.yacht.name} - €${Number(opportunity.sharePrice).toLocaleString()} per share!`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              <Share className="w-5 h-5 text-gray-900" />
            </Button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="relative">
        <img 
          src={opportunity.yacht.images?.[currentImageIndex] || opportunity.yacht.images?.[0]} 
          alt={opportunity.yacht.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {opportunity.yacht.images?.length || 1}
        </div>
        <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {opportunity.shareFraction} Share Available
        </div>
      </section>

      {/* Investment Overview */}
      <section className="px-4 py-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{opportunity.yacht.name}</h1>
            <p className="text-gray-600 mb-2">{opportunity.yacht.location}</p>

          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">€{Number(opportunity.sharePrice).toLocaleString()}</p>
            <p className="text-gray-600">per share</p>
            <p className="text-xs text-blue-600 font-medium">from €{(opportunity.financing as any)?.monthlyPayment ? Number((opportunity.financing as any).monthlyPayment).toLocaleString() : Math.round(Number(opportunity.sharePrice) / 60).toLocaleString()} monthly</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-600">6%</p>
            <p className="text-xs text-gray-500">Expected ROI</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-600">{opportunity.usageDaysPerYear}</p>
            <p className="text-xs text-gray-500">Days/Year</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Cog className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-600">50</p>
            <p className="text-xs text-gray-500">Engine Hours</p>
          </div>
        </div>


      </section>

      <div className="px-4 space-y-6 -mt-2">
        {/* Yacht Specifications */}
        <Card>
          <CardContent className="p-3">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Yacht Specifications</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="font-semibold text-gray-900 text-xs">{opportunity.yacht.capacity}</p>
                <p className="text-xs text-gray-600">Guests</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Bed className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="font-semibold text-gray-900 text-xs">{opportunity.yacht.cabins}</p>
                <p className="text-xs text-gray-600">Cabins</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="font-semibold text-gray-900 text-xs">{opportunity.yacht.length} ft</p>
                <p className="text-xs text-gray-600">Length</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="font-semibold text-gray-900 text-xs">{opportunity.yacht.yearBuilt}</p>
                <p className="text-xs text-gray-600">Year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ownership Benefits */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ownership Benefits</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Full Management Included</p>
                  <p className="text-sm text-gray-600">Professional maintenance, insurance, and crew management</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Global Access</p>
                  <p className="text-sm text-gray-600">Free days abroad through our dealer partner network</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Rental Income</p>
                  <p className="text-sm text-gray-600">Earn from charter rentals when not using your weeks</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Flexible Usage</p>
                  <p className="text-sm text-gray-600">Trade weeks with other owners or destinations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Euro className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Share Price</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-500">€{Number(opportunity.sharePrice).toLocaleString()}</span>
                  <p className="text-xs text-gray-600">from €{(opportunity.financing as any)?.monthlyPayment ? Number((opportunity.financing as any).monthlyPayment).toLocaleString() : Math.round(Number(opportunity.sharePrice) / 60).toLocaleString()} monthly</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Ownership Fraction</span>
                </div>
                <span className="text-lg font-bold text-blue-500">{opportunity.shareFraction}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Annual Usage</span>
                </div>
                <span className="text-lg font-bold text-blue-500">{opportunity.usageDaysPerYear} days</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Cog className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Annual Engine Hours</span>
                </div>
                <span className="text-lg font-bold text-blue-500">50 hours</span>
              </div>

              {opportunity.financing && (opportunity.financing as any).available && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-900">Financing Available</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-500">€{(opportunity.financing as any).monthlyPayment}/mo</span>
                    <p className="text-xs text-gray-600">{(opportunity.financing as any).downPaymentPercent}% down</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

{/* ROI Projection */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Projection</h3>
            <div className="space-y-3">
              {roiData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{data.year}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(data.value / 20) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-green-600 w-10 text-right">{data.value}%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              * Projections based on historical performance and market analysis
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Link href={`/ownership-inquiry/${opportunity.id}`}>
            <Button className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:bg-blue-700">
              Call Nauttec Team
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Schedule Viewing
            </Button>
            <Button variant="outline" className="p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Download Prospectus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
