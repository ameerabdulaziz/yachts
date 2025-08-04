import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { Search, Bell, Heart, Star, Users, Bed, Calendar, MapPin, Ship, TrendingUp, Plus, History } from "lucide-react";
import nauttecLogo from "@assets/Nauttec Logo_1754330395988.png";
import { mockYachts, mockOwnershipOpportunities } from "@/lib/mockData";

export default function HomeScreen() {
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-8 bg-white rounded-lg flex items-center justify-center p-1">
              <img src={nauttecLogo} alt="Nauttec Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/dev-navigation">
              <Button variant="ghost" size="sm" className="p-2 text-xs">
                All Screens
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="p-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">JD</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative px-4 py-8 text-white overflow-hidden">
        {/* Shallow Water Background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="50%" stopColor="#4FC3F7" />
                <stop offset="100%" stopColor="#29B6F6" />
              </linearGradient>
              <filter id="wave">
                <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#waterGradient)" />
            <ellipse cx="200" cy="180" rx="300" ry="40" fill="rgba(255,255,255,0.2)" filter="url(#wave)" />
            <ellipse cx="150" cy="170" rx="200" ry="25" fill="rgba(255,255,255,0.1)" />
            <ellipse cx="250" cy="175" rx="150" ry="20" fill="rgba(255,255,255,0.15)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Book Your Yacht</h2>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
              <Input 
                placeholder="Monaco, France" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-gray-900 font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Guests</label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="text-gray-900 font-medium">
                  <SelectValue placeholder="2-8 guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-8">2-8 guests</SelectItem>
                  <SelectItem value="8-12">8-12 guests</SelectItem>
                  <SelectItem value="12+">12+ guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Check-in</label>
              <Input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="text-gray-900 font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Check-out</label>
              <Input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="text-gray-900 font-medium"
              />
            </div>
          </div>
          <Button className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:bg-blue-700">
            <Search className="w-5 h-5 mr-2" />
            Search Yachts
          </Button>
          </div>
        </div>
      </section>

      {/* Featured Yachts */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Featured Yachts</h3>
          <Button variant="ghost" className="text-primary font-semibold">View All</Button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-4" style={{ width: "max-content" }}>
            {mockYachts.map((yacht) => (
              <Link key={yacht.id} href={`/yacht-details/${yacht.id}`}>
                <Card className="w-80 card-hover cursor-pointer">
                  <div className="relative">
                    <img 
                      src={yacht.images[0]} 
                      alt={yacht.name}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white"
                    >
                      <Heart className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{yacht.name}</h4>
                        <p className="text-gray-600 text-sm">{yacht.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{yacht.rating} ({yacht.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span><Users className="w-4 h-4 inline mr-1" />{yacht.capacity} guests</span>
                        <span><Bed className="w-4 h-4 inline mr-1" />{yacht.cabins} cabins</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">€{yacht.pricePerDay}</p>
                        <p className="text-sm text-gray-600">per day</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ownership Opportunities */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Ownership Opportunities</h3>
          <Link href="/ownership-opportunities">
            <Button variant="ghost" className="text-primary font-semibold">View All</Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-4" style={{ width: "max-content" }}>
            {mockOwnershipOpportunities.map((opportunity) => (
              <Link key={opportunity.id} href={`/ownership/${opportunity.id}`}>
                <Card className="w-80 card-hover cursor-pointer">
                  <div className="relative">
                    <img 
                      src={opportunity.yacht.images[0]} 
                      alt={opportunity.yacht.name}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {opportunity.shareFraction}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-3 left-3 p-2 bg-white/80 rounded-full hover:bg-white"
                    >
                      <Heart className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{opportunity.yacht.name}</h4>
                        <p className="text-gray-600 text-sm">{opportunity.yacht.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${opportunity.availableShares > 2 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className={`text-xs font-medium ${opportunity.availableShares > 2 ? 'text-green-600' : 'text-orange-600'}`}>
                          {opportunity.availableShares} shares available
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span><Calendar className="w-4 h-4 inline mr-1" />{opportunity.usageWeeks} weeks/year</span>
                        <span><Users className="w-4 h-4 inline mr-1" />{opportunity.yacht.capacity} guests</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">€{opportunity.sharePrice}</p>
                        <p className="text-sm text-gray-600">per share</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fuel Wallet Preview */}
      <section className="px-4 py-6 bg-gradient-to-r from-green-50 to-blue-50">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-gas-pump text-green-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Fuel Wallet</h3>
                  <p className="text-sm text-gray-600">Current Balance</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">€1,250</p>
                <p className="text-sm text-green-600">+€200 this month</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/top-up" className="flex-1">
                <Button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up
                </Button>
              </Link>
              <Link href="/fuel-wallet" className="flex-1">
                <Button variant="outline" className="w-full py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section className="px-4 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Ship className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Booking confirmed for Serenity Princess</p>
                  <p className="text-sm text-gray-600">June 15-18, 2024 • Monaco</p>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Share purchase completed</p>
                  <p className="text-sm text-gray-600">Azure Legend 1/8 share • €45,000</p>
                </div>
                <span className="text-xs text-gray-500">1d ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
}
