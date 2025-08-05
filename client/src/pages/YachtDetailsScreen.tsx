import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Share, Star, Users, Bed, Ruler, Calendar, Wifi, Utensils, Volume2, Snowflake, MessageCircle, CheckCircle } from "lucide-react";
import { mockYachts } from "@/lib/mockData";
import BottomNavigation from "@/components/BottomNavigation";

export default function YachtDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Find yacht by ID (in real app, this would be an API call)
  const yacht = mockYachts.find(y => y.id === id) || mockYachts[0];

  const amenityIcons: Record<string, any> = {
    "WiFi": Wifi,
    "Kitchen": Utensils,
    "Swimming platform": Users,
    "Sound system": Volume2,
    "Air conditioning": Snowflake,
    "Jacuzzi": Users
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="flex items-center justify-between p-4">
          <Link href="/home">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </Button>
          </Link>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-900'}`} />
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
          src={yacht.images?.[currentImageIndex] || yacht.images?.[0]} 
          alt={yacht.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {yacht.images.length}
        </div>
        {yacht.images && yacht.images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex space-x-2">
            {yacht.images?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Yacht Details */}
      <section className="px-4 py-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{yacht.name}</h1>
            <p className="text-gray-600 mb-2">{yacht.location}</p>
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">{yacht.rating} ({yacht.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">€{yacht.pricePerDay}</p>
            <p className="text-gray-600">per day</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-semibold text-gray-900 text-sm">{yacht.capacity}</p>
            <p className="text-xs text-gray-600">Guests</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Bed className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-semibold text-gray-900 text-sm">{yacht.cabins}</p>
            <p className="text-xs text-gray-600">Cabins</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Ruler className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-semibold text-gray-900 text-sm">{yacht.length} ft</p>
            <p className="text-xs text-gray-600">Length</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-semibold text-gray-900 text-sm">{yacht.yearBuilt}</p>
            <p className="text-xs text-gray-600">Built</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About this yacht</h3>
          <p className="text-gray-700 leading-relaxed">
            {yacht.description || "Experience luxury on the water with this magnificent yacht. Perfect for special occasions, family gatherings, or romantic getaways. Equipped with all modern amenities and maintained to the highest standards."}
          </p>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-3">
            {yacht.amenities?.map((amenity) => {
              const IconComponent = amenityIcons[amenity] || CheckCircle;
              return (
                <div key={amenity} className="flex items-center space-x-2">
                  <IconComponent className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={yacht.owner.avatar} alt={yacht.owner.name} />
              <AvatarFallback>{yacht.owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900">{yacht.owner.name}</h4>
              </div>
              <p className="text-sm text-gray-600">Boat owner</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-600">{yacht.owner.rating} (89 reviews)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Availability</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Available</span>
            </div>
            <p className="text-sm text-green-700">October 15-30, 2025 • November 1-15, 2025</p>
          </div>
        </div>
      </section>

      {/* Pricing & Book Button */}
      <section className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">€{yacht.pricePerDay}</p>
            <p className="text-gray-600">per day</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Next available</p>
            <p className="font-semibold text-gray-900">October 15, 2025</p>
          </div>
        </div>
        
        <Link href={`/booking/${yacht.id}`}>
          <Button className="w-full bg-gradient-ocean text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300">
            Book Now
          </Button>
        </Link>
      </section>
      
      <BottomNavigation />
    </div>
  );
}
