import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Share, Heart, TrendingUp, TrendingDown, Calendar, MapPin, Users, Star, MessageCircle, Shield, AlertCircle } from "lucide-react";

export default function ShareListingDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const listing = {
    id: id || "listing-1",
    yacht: {
      name: "Azure Legend",
      location: "French Riviera",
      images: [
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
      ],
      capacity: 10,
      cabins: 5,
      length: 85,
      yearBuilt: 2021
    },
    shareFraction: "1/8",
    sharesForSale: 1,
    originalPrice: 45000,
    askingPrice: 48000,
    priceChange: 6.7,
    usageDaysPerYear: 40,
    seller: {
      name: "Sarah Mitchell",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      rating: 4.9,
      verified: true,
      memberSince: "2022",
      totalSales: 3
    },
    listedDate: new Date("2024-05-15"),
    reason: "Upgrading to larger share",
    description: "This 1/8 share in Azure Legend has been an amazing investment. The yacht is impeccably maintained and managed by a professional crew. Perfect for family vacations in the Mediterranean. Selling only because I'm upgrading to a 1/4 share.",
    usageSchedule: [
      { month: "June", weeks: ["Week 2"] },
      { month: "July", weeks: ["Week 4"] },
      { month: "August", weeks: ["Week 1"] },
      { month: "September", weeks: ["Week 3"] },
      { month: "October", weeks: ["Week 2"] },
      { month: "November", weeks: ["Week 1"] }
    ],
    marketHistory: [
      { date: "2022", price: 40000 },
      { date: "2023", price: 43000 },
      { date: "2024", price: 45000 },
      { date: "Current", price: 48000 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="flex items-center justify-between p-4">
          <Link href="/share-marketplace">
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
          src={listing.yacht.images[currentImageIndex]} 
          alt={listing.yacht.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {listing.yacht.images.length}
        </div>
        <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {listing.shareFraction} Share for Sale
        </div>
      </section>

      {/* Listing Overview */}
      <section className="px-4 py-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.yacht.name}</h1>
            <p className="text-gray-600 mb-2">{listing.yacht.location}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{listing.shareFraction} share</Badge>
              <Badge variant="outline">{listing.usageDaysPerYear} days/year</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">€{listing.askingPrice.toLocaleString()}</p>
            <div className={`flex items-center space-x-1 text-sm ${
              listing.priceChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {listing.priceChange > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(listing.priceChange)}% vs. original</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-semibold text-gray-900 text-sm">{listing.yacht.capacity}</p>
            <p className="text-xs text-gray-600">Guests</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-semibold text-gray-900 text-sm">{listing.yacht.cabins}</p>
            <p className="text-xs text-gray-600">Cabins</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-semibold text-gray-900 text-sm">{listing.yacht.length} ft</p>
            <p className="text-xs text-gray-600">Length</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Star className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-semibold text-gray-900 text-sm">{listing.yacht.yearBuilt}</p>
            <p className="text-xs text-gray-600">Built</p>
          </div>
        </div>
      </section>

      <div className="px-4 space-y-6">
        {/* Seller Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Seller</h3>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={listing.seller.avatar} alt={listing.seller.name} />
                <AvatarFallback>{listing.seller.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{listing.seller.name}</h4>
                  {listing.seller.verified && (
                    <Shield className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{listing.seller.rating}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Member since {listing.seller.memberSince} • {listing.seller.totalSales} successful sales
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700 font-medium mb-1">Reason for selling:</p>
              <p className="text-sm text-gray-600">{listing.reason}</p>
            </div>
            
            <Button className="w-full bg-primary text-white py-3 rounded-xl font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Seller
            </Button>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </CardContent>
        </Card>

        {/* Usage Schedule */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Schedule (2024)</h3>
            <div className="space-y-3">
              {listing.usageSchedule.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-900">{schedule.month}</span>
                  <div className="flex space-x-2">
                    {schedule.weeks.map((week, i) => (
                      <Badge key={i} className="bg-primary text-white text-xs">
                        {week}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Flexible scheduling available through owner exchange program
            </p>
          </CardContent>
        </Card>

        {/* Price History */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price History</h3>
            <div className="space-y-3">
              {listing.marketHistory.map((history, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{history.date}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(history.price / 50000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-20 text-right">
                      €{history.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investment Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Original Purchase Price</span>
                <span className="text-gray-700">€{listing.originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Current Asking Price</span>
                <span className="font-bold text-primary">€{listing.askingPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-900">Appreciation</span>
                <span className="font-bold text-green-600">€{(listing.askingPrice - listing.originalPrice).toLocaleString()} (+{listing.priceChange}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card>
          <CardContent className="p-4 bg-amber-50">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Important Information</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Transfer fees and legal costs apply</li>
                  <li>• Share transfer subject to management company approval</li>
                  <li>• Annual management fees: €3,200 per 1/8 share</li>
                  <li>• Usage weeks are allocated annually by lottery system</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button className="w-full bg-gradient-ocean text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300">
            Make an Offer - €{listing.askingPrice.toLocaleString()}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="py-3 rounded-xl font-semibold">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message Seller
            </Button>
            <Button variant="outline" className="py-3 rounded-xl font-semibold">
              Schedule Viewing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
