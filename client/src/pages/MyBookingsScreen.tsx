import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Calendar, Users, MapPin, Clock, Filter, Search } from "lucide-react";
import { mockBookings } from "@/lib/mockData";
import seaBackground from "@assets/image_1754575606863.png";
import deAntonioD50 from "@assets/image_1754579474724.png";

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
      guestCount: 8,
      totalPrice: "4200.00",
      status: "confirmed" as const,
      addOns: { captain: true, catering: true },
      paymentMethod: "fuel-wallet",
      createdAt: new Date(),
      updatedAt: new Date(),
      yacht: {
        id: "yacht-2",
        name: "De Antonio D42",
        location: "El Gouna, Egypt",
        pricePerDay: "2100.00",
        images: ["https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg"]
      }
    },
    {
      id: "booking-3",
      yachtId: "yacht-3", 
      userId: "user-1",
      startDate: new Date("2025-12-15"),
      endDate: new Date("2025-12-17"),
      guestCount: 6,
      totalPrice: "2800.00",
      status: "confirmed" as const,
      addOns: { captain: false, catering: false },
      paymentMethod: "credit-card",
      createdAt: new Date(),
      updatedAt: new Date(),
      yacht: {
        id: "yacht-3",
        name: "De Antonio D36",
        location: "El Gouna, Egypt", 
        pricePerDay: "1400.00",
        images: ["https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D36.jpg"]
      }
    },
    {
      id: "booking-4",
      yachtId: "yacht-4",
      userId: "user-1", 
      startDate: new Date("2026-01-10"),
      endDate: new Date("2026-01-12"),
      guestCount: 10,
      totalPrice: "5600.00",
      status: "pending" as const,
      addOns: { captain: true, catering: true },
      paymentMethod: "fuel-wallet",
      createdAt: new Date(),
      updatedAt: new Date(),
      yacht: {
        id: "yacht-4",
        name: "De Antonio D60",
        location: "El Gouna, Egypt",
        pricePerDay: "2800.00",
        images: ["https://static.wixstatic.com/media/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg"]
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

      {/* Booking Stats with Sea Background */}
      <section className="relative px-4 py-8 overflow-hidden">
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
            <h2 className="text-2xl font-bold mb-2 text-gray-800">My Booking History</h2>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                <p className="text-gray-600 text-sm">Total Trips</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                <p className="text-gray-600 text-sm">Upcoming</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">€{bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0).toLocaleString()}</p>
                <p className="text-gray-600 text-sm">Total Spent</p>
              </div>
            </div>
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
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="relative">
                      <img
                        src={booking.yacht.images?.[0] || deAntonioD50}
                        alt={booking.yacht.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Yacht Info */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.yacht.name}</h3>
                          <p className="text-sm text-gray-600">{booking.yacht.location}</p>
                        </div>

                        {/* Booking Details */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{booking.startDate.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{booking.guestCount} guests</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.ceil((booking.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
                          </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total Cost</span>
                            <span className="text-sm font-semibold text-blue-600">€{Number(booking.totalPrice).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Duration</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </div>
                          {(booking.addOns?.captain || booking.addOns?.catering) && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Add-ons</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {[
                                  booking.addOns?.captain && "Captain",
                                  booking.addOns?.catering && "Catering"
                                ].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Preview */}
                        <div className="flex gap-2 pt-2">
                          <div className="flex-1 text-center">
                            <div className="text-xs text-gray-500">Tap to view details</div>
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
                          src={booking.yacht.images?.[0] || deAntonioD50} 
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
