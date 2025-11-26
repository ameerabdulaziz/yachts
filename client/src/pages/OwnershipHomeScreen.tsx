import { useState, useEffect } from "react";
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
  Clock,
  MapPin
} from "lucide-react";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";
import seaBackground from "@assets/image_1754575606863.png";
import BottomNavigation from "@/components/BottomNavigation";
import { enhancedScrollToTop } from "@/utils/scrollToTop";

export default function OwnershipHomeScreen() {
  const [selectedModel, setSelectedModel] = useState("D42 Open");

  const yachtModels = [
    { id: "D28 Open", name: "D28 Open", length: "28ft", passengers: 10, price: "€203K", sharesFrom: "€41K", image: "https://images.boatsgroup.com/images/1/63/84/de-antonio-yachts-d28-open-9226384-20240502160147-0.jpg" },
    { id: "D34 Open", name: "D34 Open", length: "34ft", passengers: 11, price: "€170K", sharesFrom: "€34K", image: "https://images.boatsgroup.com/images/1/13/61/de-antonio-yachts-d34-open-9091361-20240109094358-0.jpg" },
    { id: "D34 Cruiser", name: "D34 Cruiser", length: "34ft", passengers: 11, price: "€180K", sharesFrom: "€36K", image: "https://images.boatsgroup.com/images/1/85/3/de-antonio-yachts-d34-cruiser-9068503-20231212093632-0.jpg" },
    { id: "D42 Open", name: "D42 Open", length: "42ft", passengers: 12, price: "€535K", sharesFrom: "€107K", image: "https://images.boatsgroup.com/images/1/17/29/de-antonio-yachts-d42-9141729-20240221104818-0.jpg" },
    { id: "D50 Open", name: "D50 Open", length: "50ft", passengers: 12, price: "€1,219K", sharesFrom: "€244K", image: "https://images.boatsgroup.com/images/1/51/79/de-antonio-yachts-d50-open-9275179-20240619063113-0.jpg" },
    { id: "D50 Coupe", name: "D50 Coupe", length: "50ft", passengers: 12, price: "€1,300K", sharesFrom: "€260K", image: "https://images.boatsgroup.com/images/1/75/30/de-antonio-yachts-d50-coupe-9177530-20240404054946-0.jpg" }
  ];

  const selectedYacht = yachtModels.find(y => y.id === selectedModel) || yachtModels[3];

  const ownershipBenefits = [
    { icon: Star, title: "Hassle Free", desc: "Complete management and maintenance included" },
    { icon: MapPin, title: "Global Access", desc: "Free days abroad through our dealer partner network" },
    { icon: Euro, title: "Revenue from Renting", desc: "Earn income when not using your yacht" },
    { icon: Users, title: "Co-Owner Network", desc: "Connect with like-minded yacht enthusiasts" }
  ];



  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Extended Background */}
      <div className="relative">
        {/* Extended Sea Background */}
        <div className="absolute inset-0 bg-gradient-ocean" style={{ height: '680px' }}>
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${seaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-blue-200/20 to-blue-500/30" />
        </div>

        {/* Header */}
        <header className="relative bg-transparent px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-30 h-[60px] flex items-start justify-start">
                <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain object-left" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/profile" onClick={enhancedScrollToTop}>
                <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="User Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section - Ownership Focus */}
        <section className="relative px-4 py-2 overflow-hidden">
          {/* Content is now overlaying the extended background */}
          
          <div className="relative z-10">
          
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
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>De Antonio {selectedYacht.name}</h3>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
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
                  className={`text-xs ${
                    selectedModel === yacht.id 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {yacht.name}
                </Button>
              ))}
            </div>

            {/* Pricing Display */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Full Ownership</p>
                  <p className="text-xl font-bold text-gray-900 whitespace-nowrap" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>{selectedYacht.price}</p>
                </div>
                <div className="text-center border-l border-blue-200 pl-4">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Share From</p>
                  <p className="text-xl font-bold text-blue-600 whitespace-nowrap" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>{selectedYacht.sharesFrom}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>from €{Math.round(parseFloat(selectedYacht.sharesFrom.replace('€', '').replace('K', '').replace(',', '')) * 1000 / 60).toLocaleString()} monthly</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/ownership/${selectedYacht.id}`}>
                <Button 
                  className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:bg-blue-700 border-0 flex items-center justify-center"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  onClick={enhancedScrollToTop}
                >
                  <Anchor className="w-4 h-4 mr-0.5" />
                  Own This Yacht
                </Button>
              </Link>
              <Link href="/ownership-opportunities">
                <Button 
                  variant="outline" 
                  className="w-full p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  onClick={enhancedScrollToTop}
                >
                  <ArrowRight className="w-4 h-4 mr-0.5" />
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* Ownership Benefits */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Why Own with Nauttec?</h2>
        <div className="grid grid-cols-2 gap-4">
          {ownershipBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{benefit.title}</h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{benefit.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Available Shares - Priority Section */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Available Shares</h2>
          <Link href="/share-marketplace">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-blue-500 text-blue-500 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              onClick={enhancedScrollToTop}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-4">
          {[
            { 
              id: "share-saxdor-320-gto", 
              model: "320 GTO", 
              location: "El Gouna", 
              availableShares: 2, 
              totalShares: 5, 
              sharePrice: "€64,600", 
              monthlyPayment: "€1,126",
              usageDaysPerYear: 73, 
              capacity: 10, 
              expectedROI: "6-8%",
              priority: false, 
              image: "https://images.boatsgroup.com/images/1/13/61/de-antonio-yachts-d34-open-9091361-20240109094358-0.jpg" 
            },
            { 
              id: "share-saxdor-340-gtwa", 
              model: "340 GTWA", 
              location: "El Gouna", 
              availableShares: 1, 
              totalShares: 5, 
              sharePrice: "€72,200", 
              monthlyPayment: "€1,258",
              usageDaysPerYear: 73, 
              capacity: 12, 
              expectedROI: "5-7%",
              priority: false, 
              image: "https://images.boatsgroup.com/images/1/17/29/de-antonio-yachts-d42-9141729-20240221104818-0.jpg" 
            },
            { 
              id: "share-saxdor-400-gto", 
              model: "400 GTO", 
              location: "El Gouna", 
              availableShares: 2, 
              totalShares: 5, 
              sharePrice: "€78,800", 
              monthlyPayment: "€1,373",
              usageDaysPerYear: 73, 
              capacity: 12, 
              expectedROI: "4-6%",
              priority: true, 
              image: "https://images.boatsgroup.com/images/1/51/79/de-antonio-yachts-d50-open-9275179-20240619063113-0.jpg"
            },
            { 
              id: "share-saxdor-400-gts", 
              model: "400 GTS", 
              location: "El Gouna", 
              availableShares: 3, 
              totalShares: 5, 
              sharePrice: "€85,600", 
              monthlyPayment: "€1,492",
              usageDaysPerYear: 73, 
              capacity: 12, 
              expectedROI: "3-5%",
              priority: true, 
              image: "https://images.boatsgroup.com/images/1/75/30/de-antonio-yachts-d50-coupe-9177530-20240404054946-0.jpg" 
            }
          ].map((opportunity) => (
            <Link key={opportunity.id} href={`/ownership/${opportunity.id}`}>
              <Card 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white rounded-xl overflow-hidden"
                onClick={enhancedScrollToTop}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={opportunity.image} 
                      alt={`De Antonio ${opportunity.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 p-2 rounded-full">
                      <Anchor className="w-4 h-4 text-gray-900" />
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold">{opportunity.availableShares} Available</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                          De Antonio {opportunity.model}
                        </h3>
                        <p className="text-gray-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {opportunity.location}
                        </p>
                      </div>
                      <div className="text-right flex flex-col">
                        <p className="text-2xl font-bold text-blue-600 whitespace-nowrap" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                          {opportunity.sharePrice}
                        </p>
                        <p className="text-sm text-gray-500 whitespace-nowrap" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          per share
                        </p>
                        <p className="text-xs text-blue-600 font-medium whitespace-nowrap" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          from {opportunity.monthlyPayment} monthly
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="font-semibold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {opportunity.usageDaysPerYear}
                        </p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          days/year
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="font-semibold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {opportunity.capacity}
                        </p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          guests
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="font-semibold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {opportunity.expectedROI}
                        </p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          Expected ROI
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {opportunity.location}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${opportunity.availableShares > 2 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className={`text-xs font-medium ${opportunity.availableShares > 2 ? 'text-green-600' : 'text-orange-600'}`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          {opportunity.availableShares} shares left
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors" 
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        enhancedScrollToTop();
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Dealer Partner Program */}
      <section className="px-4 py-6">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Exclusive Owner Benefits</h2>
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 mr-3" />
              <div>
                <h3 className="font-semibold" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Free Days Abroad</h3>
                <p className="text-blue-100 text-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Access boats worldwide through our dealer partner program</p>
              </div>
            </div>
            <Link href="/ownership-opportunities">
              <Button 
                className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                onClick={enhancedScrollToTop}
              >
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
              <Button 
                variant="outline" 
                className="font-semibold"
                onClick={enhancedScrollToTop}
              >
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