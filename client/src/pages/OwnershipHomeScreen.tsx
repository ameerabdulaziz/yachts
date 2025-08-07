import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Crown, 
  TrendingUp, 
  Shield, 
  Users, 
  Calendar,
  Anchor,
  Euro,
  Star,
  Clock
} from "lucide-react";
import nauttecLogo from "@assets/Nauttec Logo_1754330395988.png";
import BottomNavigation from "@/components/BottomNavigation";

export default function OwnershipHomeScreen() {
  const [selectedModel, setSelectedModel] = useState("D42");

  const yachtModels = [
    { id: "E23", name: "E23", length: "7.20m", passengers: 8, price: "€280K", sharesFrom: "€28K", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" },
    { id: "D29", name: "D29", length: "8.50m", passengers: 8, price: "€350K", sharesFrom: "€35K", image: "https://images.unsplash.com/photo-1566024287286-457247b70310?auto=format&fit=crop&w=800&q=80" },
    { id: "D32", name: "D32", length: "9.90m", passengers: 10, price: "€480K", sharesFrom: "€48K", image: "https://images.unsplash.com/photo-1570479398395-87749b0aeca2?auto=format&fit=crop&w=800&q=80" },
    { id: "D36", name: "D36", length: "11.50m", passengers: 12, price: "€650K", sharesFrom: "€65K", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80" },
    { id: "D42", name: "D42", length: "12.64m", passengers: 12, price: "€890K", sharesFrom: "€89K", image: "https://images.unsplash.com/photo-1593351415075-3bac8c2b7e3b?auto=format&fit=crop&w=800&q=80" },
    { id: "D60", name: "D60", length: "18.50m", passengers: 12, price: "€2.1M", sharesFrom: "€175K", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80" }
  ];

  const selectedYacht = yachtModels.find(y => y.id === selectedModel) || yachtModels[4];

  const ownershipBenefits = [
    { icon: Crown, title: "Premium Ownership", desc: "Fractional ownership with full yacht privileges" },
    { icon: TrendingUp, title: "Asset Appreciation", desc: "Potential value growth in luxury yacht market" },
    { icon: Shield, title: "Hassle-Free", desc: "Complete management and maintenance included" },
    { icon: Users, title: "Co-Owner Network", desc: "Connect with fellow yacht enthusiasts" }
  ];

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

      {/* Hero Section - Ownership Focus */}
      <section className="relative px-4 py-8 text-white overflow-hidden">
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
        
        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="text-center mb-3">
              <h1 className="text-3xl font-bold">Own Your Dream Yacht</h1>
            </div>
            <p className="text-blue-100 text-lg">Fractional ownership starting from €28K</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            {/* Yacht Image */}
            <div className="mb-4">
              <img 
                src={selectedYacht.image} 
                alt={`De Antonio ${selectedYacht.name}`}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">De Antonio {selectedYacht.name}</h3>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                <span>{selectedYacht.length}</span>
                <span>•</span>
                <span>{selectedYacht.passengers} guests</span>
                <span>•</span>
                <span>El Gouna, Egypt</span>
              </div>
            </div>

            {/* Yacht Model Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {yachtModels.map((yacht) => (
                <Button
                  key={yacht.id}
                  variant={selectedModel === yacht.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedModel(yacht.id)}
                  className={`text-xs ${selectedModel === yacht.id ? "bg-blue-600" : ""}`}
                >
                  {yacht.name}
                </Button>
              ))}
            </div>

            {/* Pricing Display */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Full Ownership</p>
                  <p className="text-xl font-bold text-gray-900">{selectedYacht.price}</p>
                </div>
                <div className="text-center border-l border-blue-200 pl-4">
                  <p className="text-sm text-gray-600 mb-1">1/10 Share From</p>
                  <p className="text-xl font-bold text-blue-600">{selectedYacht.sharesFrom}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/ownership/${selectedYacht.id}`}>
                <Button className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:bg-blue-700">
                  <Anchor className="w-4 h-4 mr-2" />
                  Own This Yacht
                </Button>
              </Link>
              <Link href="/ownership-opportunities">
                <Button variant="outline" className="w-full p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ownership Benefits */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Why Own with Yachtak?</h2>
        <div className="grid grid-cols-2 gap-4">
          {ownershipBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Available Shares - Priority Section */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Available Shares</h2>
          <Link href="/share-marketplace">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {[
            { model: "D60", location: "El Gouna", shares: "2/10", price: "€175K", status: "Available", priority: true },
            { model: "D42", location: "El Gouna", shares: "1/10", price: "€89K", status: "Last Share", priority: true },
            { model: "D36", location: "El Gouna", shares: "3/10", price: "€65K", status: "Available", priority: false }
          ].map((share, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Anchor className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">De Antonio {share.model}</h3>
                        {share.priority && <Badge className="bg-orange-100 text-orange-800">Priority</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{share.location} • {share.shares} shares</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{share.price}</p>
                    <p className="text-sm text-green-600">{share.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-6">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Investment Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Euro className="w-5 h-5" />
                  <span className="text-2xl font-bold">€0</span>
                </div>
                <p className="text-blue-100 text-sm">Portfolio Value</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold">0</span>
                </div>
                <p className="text-blue-100 text-sm">Days Available</p>
              </div>
            </div>
            <Link href="/ownership-opportunities">
              <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                Start Your Ownership Journey
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Rental Option - Secondary */}
      <section className="px-4 py-6">
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Ready to Own?</h3>
            <p className="text-gray-600 mb-4">Experience luxury yachting with our rental options first</p>
            <Link href="/home">
              <Button variant="outline" className="font-semibold">
                Explore Rentals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}