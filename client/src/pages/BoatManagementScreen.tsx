import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Star, Calendar, Users, MapPin, Euro, Settings, Camera, AlertCircle, TrendingUp } from "lucide-react";

export default function BoatManagementScreen() {
  const { id } = useParams<{ id: string }>();
  
  const yacht = {
    id: id || "yacht-1",
    name: "Serenity Princess",
    location: "Monaco, France",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    ],
    status: "available",
    pricePerDay: 2400,
    capacity: 12,
    cabins: 6,
    rating: 4.9,
    reviewCount: 127,
    totalBookings: 18,
    monthlyRevenue: 7200,
    occupancyRate: 78,
    nextMaintenance: "July 15, 2024"
  };

  const bookings = [
    {
      id: "booking-1",
      guestName: "John Doe",
      dates: "June 15-18, 2024",
      guests: 6,
      revenue: 8190,
      status: "confirmed"
    },
    {
      id: "booking-2",
      guestName: "Sarah Miller",
      dates: "June 22-24, 2024",
      guests: 4,
      revenue: 3600,
      status: "pending"
    }
  ];

  const reviews = [
    {
      id: "review-1",
      guestName: "Michael R.",
      rating: 5,
      comment: "Absolutely amazing yacht! Perfect for our family vacation.",
      date: "May 28, 2024"
    },
    {
      id: "review-2",
      guestName: "Emma L.",
      rating: 5,
      comment: "Captain was excellent, yacht was immaculate. Highly recommend!",
      date: "May 20, 2024"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/owner-dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Manage Yacht</h1>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </header>

      {/* Yacht Images */}
      <section className="relative">
        <img 
          src={yacht.images[currentImageIndex]} 
          alt={yacht.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {yacht.images.length}
        </div>
        <div className="absolute top-4 right-4">
          <Button size="sm" className="bg-white/80 text-gray-900 hover:bg-white">
            <Camera className="w-4 h-4 mr-1" />
            Photos
          </Button>
        </div>
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
          yacht.status === 'available' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
        }`}>
          {yacht.status}
        </div>
      </section>

      {/* Yacht Info */}
      <section className="px-4 py-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{yacht.name}</h2>
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
            <p className="text-2xl font-bold text-gray-900">€{yacht.pricePerDay}</p>
            <p className="text-gray-600">per day</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-sm font-semibold">{yacht.capacity}</p>
            <p className="text-xs text-gray-600">Guests</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-sm font-semibold">{yacht.cabins}</p>
            <p className="text-xs text-gray-600">Cabins</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-sm font-semibold">{yacht.totalBookings}</p>
            <p className="text-xs text-gray-600">Bookings</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-semibold">{yacht.occupancyRate}%</p>
            <p className="text-xs text-gray-600">Occupied</p>
          </div>
        </div>
      </section>

      <div className="p-4">
        {/* Performance Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">€{yacht.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-700">Monthly Revenue</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{yacht.occupancyRate}%</p>
                <p className="text-sm text-blue-700">Occupancy Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/boat-calendar/${yacht.id}`}>
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Calendar className="w-6 h-6 mb-1" />
                  <span className="text-sm">Calendar</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                <Euro className="w-6 h-6 mb-1" />
                <span className="text-sm">Pricing</span>
              </Button>
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-sm">Photos</span>
              </Button>
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                <Settings className="w-6 h-6 mb-1" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{booking.guestName}</p>
                      <p className="text-sm text-gray-600">{booking.dates}</p>
                      <p className="text-sm text-gray-600">{booking.guests} guests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">€{booking.revenue.toLocaleString()}</p>
                      <Badge className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.guestName}</p>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Next Maintenance</p>
                    <p className="text-sm text-gray-600">{yacht.nextMaintenance}</p>
                    <p className="text-sm text-orange-600">Routine inspection scheduled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Maintenance History</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Engine Service</p>
                      <p className="text-sm text-gray-600">May 15, 2024</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Hull Cleaning</p>
                      <p className="text-sm text-gray-600">April 28, 2024</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
