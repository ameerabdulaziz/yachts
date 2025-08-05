import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Calendar, Users, MapPin, Clock, Filter, Search } from "lucide-react";
import { mockBookings } from "@/lib/mockData";

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800"
};

export default function MyBookingsScreen() {
  const bookings = [
    ...mockBookings,
    {
      id: "booking-2",
      yachtId: "yacht-2",
      userId: "user-1",
      startDate: new Date("2025-11-20"),
      endDate: new Date("2025-11-22"),
      guestCount: 4,
      totalPrice: "3600.00",
      status: "pending" as const,
      addOns: { captain: false, catering: true },
      paymentMethod: "fuel-wallet",
      createdAt: new Date(),
      updatedAt: new Date(),
      yacht: {
        id: "yacht-2",
        name: "Ocean's Dream",
        location: "Ibiza, Spain",
        pricePerDay: "1800.00",
        images: ["https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"]
      }
    }
  ];

  const upcomingBookings = bookings.filter(b => new Date(b.startDate) > new Date());
  const pastBookings = bookings.filter(b => new Date(b.startDate) <= new Date());

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* Booking Stats */}
      <section className="px-4 py-6 bg-gradient-ocean text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{bookings.length}</p>
            <p className="text-blue-100 text-sm">Total Trips</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{upcomingBookings.length}</p>
            <p className="text-blue-100 text-sm">Upcoming</p>
          </div>
          <div>
            <p className="text-2xl font-bold">€{bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0).toLocaleString()}</p>
            <p className="text-blue-100 text-sm">Total Spent</p>
          </div>
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Trips</h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Link key={booking.id} href={`/reservation-detail/${booking.id}`}>
                  <Card className="card-hover cursor-pointer">
                    <CardContent className="p-0">
                      <div className="flex">
                        <img 
                          src={booking.yacht.images[0]} 
                          alt={booking.yacht.name}
                          className="w-24 h-24 object-cover rounded-l-2xl"
                        />
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900">{booking.yacht.name}</h3>
                              <p className="text-sm text-gray-600">{booking.yacht.location}</p>
                            </div>
                            <Badge className={statusColors[booking.status]}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{booking.guestCount} guests</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">€{Number(booking.totalPrice).toLocaleString()}</span>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{Math.ceil((booking.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Past Trips</h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Link key={booking.id} href={`/reservation-detail/${booking.id}`}>
                  <Card className="card-hover cursor-pointer opacity-90">
                    <CardContent className="p-0">
                      <div className="flex">
                        <img 
                          src={booking.yacht.images[0]} 
                          alt={booking.yacht.name}
                          className="w-24 h-24 object-cover rounded-l-2xl"
                        />
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900">{booking.yacht.name}</h3>
                              <p className="text-sm text-gray-600">{booking.yacht.location}</p>
                            </div>
                            <Badge className={statusColors.completed}>
                              completed
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{booking.guestCount} guests</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">€{Number(booking.totalPrice).toLocaleString()}</span>
                            <Button variant="outline" size="sm">
                              Leave Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start your luxury yacht adventure today</p>
            <Link href="/home">
              <Button className="bg-gradient-ocean text-white px-8 py-3 rounded-xl font-semibold">
                Browse Yachts
              </Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
