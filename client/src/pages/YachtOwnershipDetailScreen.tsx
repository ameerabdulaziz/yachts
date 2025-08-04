import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share, Heart, TrendingUp, Calendar, MapPin, Users, Bed, Star, Euro, PieChart, Clock, Shield, CreditCard, Zap } from "lucide-react";
import { mockOwnershipOpportunities } from "@/lib/mockData";

export default function YachtOwnershipDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Find opportunity by ID
  const opportunity = mockOwnershipOpportunities.find(o => o.id === id) || mockOwnershipOpportunities[0];
  
  const roiData = [
    { year: 2026, value: 18 },
    { year: 2027, value: 14 },
    { year: 2028, value: 16 },
    { year: 2029, value: 19 },
    { year: 2030, value: 21 }
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
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm">
              <Share className="w-5 h-5 text-gray-900" />
            </Button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="relative">
        <img 
          src={opportunity.yacht.images[currentImageIndex]} 
          alt={opportunity.yacht.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {opportunity.yacht.images.length}
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
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">{opportunity.yacht.rating} ({opportunity.yacht.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">€{Number(opportunity.sharePrice).toLocaleString()}</p>
            <p className="text-gray-600">per share</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">15%</p>
            <p className="text-sm text-green-700">Expected ROI</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{opportunity.usageDaysPerYear}</p>
            <p className="text-sm text-blue-700">Days/Year</p>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-900">Available Shares</span>
            </div>
            <Badge className="bg-green-500 text-white">
              {opportunity.availableShares} of {opportunity.totalShares} remaining
            </Badge>
          </div>
          <div className="mt-3">
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(opportunity.availableShares / opportunity.totalShares) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 space-y-6">
        {/* Yacht Specifications */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yacht Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-semibold text-gray-900 text-sm">{opportunity.yacht.capacity}</p>
                <p className="text-xs text-gray-600">Max Guests</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Bed className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-semibold text-gray-900 text-sm">{opportunity.yacht.cabins}</p>
                <p className="text-xs text-gray-600">Cabins</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <MapPin className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-semibold text-gray-900 text-sm">{opportunity.yacht.length} ft</p>
                <p className="text-xs text-gray-600">Length</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-semibold text-gray-900 text-sm">{opportunity.yacht.yearBuilt}</p>
                <p className="text-xs text-gray-600">Year Built</p>
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
                <span className="text-lg font-bold text-blue-500">€{Number(opportunity.sharePrice).toLocaleString()}</span>
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
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Annual Engine Hours</span>
                </div>
                <span className="text-lg font-bold text-blue-500">50 hours</span>
              </div>

              {opportunity.financing && opportunity.financing.available && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-900">Financing Available</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-500">€{opportunity.financing.monthlyPayment}/mo</span>
                    <p className="text-xs text-gray-600">{opportunity.financing.downPaymentPercent}% down</p>
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
            <Button className="w-full bg-gradient-ocean text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300">
              Call Nauttec Team - €{Number(opportunity.sharePrice).toLocaleString()}
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="py-3 rounded-xl font-semibold">
              Schedule Viewing
            </Button>
            <Button variant="outline" className="py-3 rounded-xl font-semibold">
              Download Prospectus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
