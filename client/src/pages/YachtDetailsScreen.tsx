import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Heart, Share, Star, Users, Bed, Ruler, Calendar, Wifi, Utensils, Volume2, Snowflake, MessageCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { mockYachts } from "@/lib/mockData";
import BottomNavigation from "@/components/BottomNavigation";

export default function YachtDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [includeCatering, setIncludeCatering] = useState(false);

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

  // Calendar functionality
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today; // Simplified availability check
  };

  const isDateSelected = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) {
      return selectedStartDate && date.getTime() === selectedStartDate.getTime();
    }
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date)) return;
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (date >= selectedStartDate) {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
          {currentImageIndex + 1} / {yacht.images?.length || 0}
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
            <p className="text-3xl font-bold text-gray-900">{yacht.pricePerDay}</p>
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

        {/* Calendar Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Select Your Dates</h3>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={index} className="aspect-square">
                  {date && (
                    <button
                      onClick={() => handleDateClick(date)}
                      disabled={!isDateAvailable(date)}
                      className={`w-full h-full text-sm rounded-md flex items-center justify-center transition-colors ${
                        isDateSelected(date)
                          ? 'bg-primary text-white'
                          : isDateAvailable(date)
                          ? 'hover:bg-blue-50 text-gray-900'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Dates Display */}
            {selectedStartDate && selectedEndDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">Selected Dates:</div>
                <div className="text-sm text-gray-700">
                  {selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Catering Option */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Services</h3>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="catering"
                checked={includeCatering}
                onCheckedChange={(checked) => setIncludeCatering(!!checked)}
              />
              <div className="flex-1">
                <label htmlFor="catering" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Add Catering Service
                </label>
                <p className="text-xs text-gray-600">Professional catering with local specialties</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">€200</p>
                <p className="text-xs text-gray-600">per day</p>
              </div>
            </div>
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
      </section>

      {/* Pricing & Book Button */}
      <section className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            {selectedStartDate && selectedEndDate ? (
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  €{(() => {
                    const days = Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    const yachtCost = parseInt(yacht.pricePerDay) * days;
                    const cateringCost = includeCatering ? 200 * days : 0;
                    return (yachtCost + cateringCost).toLocaleString();
                  })()}
                </p>
                <p className="text-gray-600">total for your stay</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-gray-900">{yacht.pricePerDay}</p>
                <p className="text-gray-600">per day</p>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Next available</p>
            <p className="font-semibold text-gray-900">October 15, 2025</p>
          </div>
        </div>
        
        <Link href={`/booking-checkout${selectedStartDate && selectedEndDate ? `?yacht=${yacht.id}&start=${selectedStartDate.toISOString().split('T')[0]}&end=${selectedEndDate.toISOString().split('T')[0]}&catering=${includeCatering}` : ''}`}>
          <Button 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700"
            disabled={!selectedStartDate || !selectedEndDate}
          >
            {selectedStartDate && selectedEndDate ? 'Book Selected Dates' : 'Select Dates to Book'}
          </Button>
        </Link>

      </section>
      
      <BottomNavigation />
    </div>
  );
}
