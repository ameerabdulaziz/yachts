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
  Clock,
  MapPin
} from "lucide-react";
import nauttecLogo from "@assets/Nauttec Logo_1754330395988.png";
import seaBackground from "@assets/image_1754575606863.png";
import BottomNavigation from "@/components/BottomNavigation";
import { enhancedScrollToTop } from "@/utils/scrollToTop";

export default function OwnershipHomeScreen() {
  const [selectedModel, setSelectedModel] = useState("D42");

  const yachtModels = [
    { id: "D29", name: "D29", length: "8.50m", passengers: 8, price: "€350K", sharesFrom: "€35K", image: "https://static.wixstatic.com/media/0fb4c8_b9744cfa841b4c4388ad78ac9b49bbe7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D29.jpg" },
    { id: "D32", name: "D32", length: "9.90m", passengers: 10, price: "€480K", sharesFrom: "€48K", image: "https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg" },
    { id: "D36", name: "D36", length: "11.50m", passengers: 12, price: "€650K", sharesFrom: "€65K", image: "https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D36.jpg" },
    { id: "D42", name: "D42", length: "12.64m", passengers: 12, price: "€890K", sharesFrom: "€89K", image: "https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg" },
    { id: "D50", name: "D50", length: "15.24m", passengers: 12, price: "€1.5M", sharesFrom: "€150K", image: "https://static.wixstatic.com/media/0fb4c8_60988eb5cf834fcb876c1d06bd8af594~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D50.jpg" },
    { id: "D60", name: "D60", length: "18.50m", passengers: 12, price: "€2.1M", sharesFrom: "€175K", image: "https://static.wixstatic.com/media/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg" }
  ];

  const selectedYacht = yachtModels.find(y => y.id === selectedModel) || yachtModels[3];

  const ownershipBenefits = [
    { icon: Crown, title: "Premium Ownership", desc: "Fractional ownership with full yacht privileges" },
    { icon: Star, title: "Hassle Free", desc: "Complete management and maintenance included" },
    { icon: Euro, title: "Revenue from Renting", desc: "Earn income when not using your yacht" },
    { icon: Users, title: "Co-Owner Network", desc: "Connect with like-minded yacht enthusiasts" }
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 text-xs"
                onClick={enhancedScrollToTop}
              >
                All Screens
              </Button>
            </Link>
            <Link href="/profile">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={enhancedScrollToTop}
              >
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
            backgroundImage: `url(${seaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-blue-200/20 to-blue-500/30" />
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Own Your Dream Yacht</h1>
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
                  <p className="text-xl font-bold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>{selectedYacht.price}</p>
                </div>
                <div className="text-center border-l border-blue-200 pl-4">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>1/10 Share From</p>
                  <p className="text-xl font-bold text-blue-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>{selectedYacht.sharesFrom}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/ownership/${selectedYacht.id}`}>
                <Button 
                  className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:bg-blue-700 border-0"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  onClick={enhancedScrollToTop}
                >
                  <Anchor className="w-4 h-4 mr-2" />
                  Own This Yacht
                </Button>
              </Link>
              <Link href="/ownership-opportunities">
                <Button 
                  variant="outline" 
                  className="w-full p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 border-blue-600 text-blue-600 hover:bg-blue-50"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                  onClick={enhancedScrollToTop}
                >
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
              id: "share-d60", 
              model: "D60", 
              location: "El Gouna", 
              availableShares: 2, 
              totalShares: 10, 
              sharePrice: "175000", 
              usageDaysPerYear: 48, 
              capacity: 12, 
              priority: true, 
              image: "https://static.wixstatic.com/media/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg" 
            },
            { 
              id: "share-d42", 
              model: "D42", 
              location: "El Gouna", 
              availableShares: 1, 
              totalShares: 10, 
              sharePrice: "89000", 
              usageDaysPerYear: 48, 
              capacity: 12, 
              priority: true, 
              image: "https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg" 
            },
            { 
              id: "share-d36", 
              model: "D36", 
              location: "El Gouna", 
              availableShares: 3, 
              totalShares: 10, 
              sharePrice: "65000", 
              usageDaysPerYear: 48, 
              capacity: 12, 
              priority: false, 
              image: "https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D36.jpg" 
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
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                          €{Number(opportunity.sharePrice).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                          per share
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
                          12-15%
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
              <Button 
                className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold"
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