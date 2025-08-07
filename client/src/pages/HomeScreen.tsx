import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { Search, Heart, Star, Users, Bed, Calendar, PieChart, ChevronDown } from "lucide-react";
import nauttecLogo from "@assets/Nauttec Logo_1754330395988.png";
import seaBackground from "@assets/image_1754575606863.png";
import { mockYachts, mockOwnershipOpportunities } from "@/lib/mockData";

export default function HomeScreen() {
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Book Your Yacht</h2>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
              <Select value={location || "el-gouna"} onValueChange={setLocation}>
                <SelectTrigger className="text-gray-900 font-medium">
                  <SelectValue placeholder="El Gouna, Egypt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="el-gouna">El Gouna, Egypt</SelectItem>
                  <SelectItem value="monaco">Monaco, France</SelectItem>
                  <SelectItem value="mallorca">Palma, Mallorca</SelectItem>
                  <SelectItem value="saint-tropez">Saint-Tropez, France</SelectItem>
                </SelectContent>
              </Select>
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
                      src={yacht.images?.[0] || yacht.images?.[0]} 
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
                      src={opportunity.yacht.images?.[0] || opportunity.yacht.images?.[0]} 
                      alt={opportunity.yacht.name}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-3 right-3 bg-amber-500 text-white p-2 rounded-full">
                      <PieChart className="w-4 h-4" />
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="text-center">
                          <Calendar className="w-4 h-4 mx-auto mb-1" />
                          <span>{opportunity.usageDaysPerYear} days/year</span>
                        </div>
                        <div className="text-center">
                          <Users className="w-4 h-4 mx-auto mb-1" />
                          <span>{opportunity.yacht.capacity} guests</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">€{opportunity.sharePrice}</p>
                        <p className="text-sm text-gray-600">per share</p>
                      </div>
                    </div>
                    {opportunity.financing && (opportunity.financing as any).available && (
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Financing Available</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">€{(opportunity.financing as any).monthlyPayment}/mo</p>
                          <p className="text-xs text-gray-500">25% down</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BottomNavigation />
    </div>
  );
}
