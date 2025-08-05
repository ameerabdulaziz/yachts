import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { Plus, Ship, Calendar, Users, TrendingUp, Settings, MessageCircle, Euro, Star, ArrowRight } from "lucide-react";

export default function OwnerDashboardScreen() {
  const ownerStats = {
    totalYachts: 2,
    totalBookings: 28,
    monthlyRevenue: 12500,
    averageRating: 4.8,
    occupancyRate: 78
  };

  const yachts = [
    {
      id: "yacht-1",
      name: "Serenity Princess",
      location: "Monaco, France",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      status: "available",
      nextBooking: "June 15, 2024",
      monthlyRevenue: 7200,
      rating: 4.9,
      bookings: 18
    },
    {
      id: "yacht-2",
      name: "Ocean's Dream",
      location: "Ibiza, Spain",
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      status: "booked",
      nextBooking: "June 20, 2024",
      monthlyRevenue: 5300,
      rating: 4.7,
      bookings: 10
    }
  ];

  const recentBookings = [
    {
      id: "booking-1",
      guestName: "John D.",
      yacht: "Serenity Princess",
      dates: "June 15-18, 2024",
      revenue: 8190,
      status: "confirmed"
    },
    {
      id: "booking-2",
      guestName: "Sarah M.",
      yacht: "Ocean's Dream",
      dates: "June 22-24, 2024",
      revenue: 3600,
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="relative px-4 py-6 text-white overflow-hidden">
        {/* Turquoise Sea Background */}
        <div className="absolute inset-0 bg-gradient-ocean">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7
          }} />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 to-blue-500/40" />
        </div>
        <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Owner Dashboard</h1>
            <p className="text-blue-100">Manage your yacht portfolio</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/add-boat-listing">
              <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-1" />
                Add Yacht
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{ownerStats.totalYachts}</p>
            <p className="text-blue-100 text-sm">Yachts</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">€{ownerStats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-blue-100 text-sm">Monthly Revenue</p>
          </div>
        </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Performance Overview */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{ownerStats.totalBookings}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{ownerStats.occupancyRate}%</p>
                <p className="text-sm text-gray-600">Occupancy Rate</p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">{ownerStats.averageRating}</span>
                </div>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Yachts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">My Yachts</h3>
            <Link href="/add-boat-listing">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Yacht
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {yachts.map((yacht) => (
              <Link key={yacht.id} href={`/boat-management/${yacht.id}`}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex">
                      <img 
                        src={yacht.image} 
                        alt={yacht.name}
                        className="w-24 h-24 object-cover rounded-l-2xl"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{yacht.name}</h4>
                            <p className="text-sm text-gray-600">{yacht.location}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            yacht.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {yacht.status}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Monthly Revenue</p>
                            <p className="font-semibold text-green-600">€{yacht.monthlyRevenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Next Booking</p>
                            <p className="font-semibold text-gray-900">{yacht.nextBooking}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{yacht.rating}</span>
                            <span className="text-sm text-gray-600">({yacht.bookings} bookings)</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Bookings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
            <Button variant="ghost" className="text-primary font-semibold">
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{booking.guestName}</p>
                      <p className="text-sm text-gray-600">{booking.yacht}</p>
                      <p className="text-sm text-gray-600">{booking.dates}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">€{booking.revenue.toLocaleString()}</p>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/boat-calendar/yacht-1">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Calendar className="w-6 h-6 mb-1" />
                  <span className="text-sm">Manage Calendar</span>
                </Button>
              </Link>
              <Link href="/waitlist-management">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Users className="w-6 h-6 mb-1" />
                  <span className="text-sm">Waitlist</span>
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <MessageCircle className="w-6 h-6 mb-1" />
                  <span className="text-sm">Messages</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                <TrendingUp className="w-6 h-6 mb-1" />
                <span className="text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Insights */}
        <Card>
          <CardContent className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Revenue Growth</h4>
                <p className="text-sm text-green-700">+23% increase from last month</p>
                <p className="text-xs text-green-600">Peak season approaching - optimize pricing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
