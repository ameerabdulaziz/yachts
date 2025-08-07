import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { Ship, TrendingUp, Calendar, Users, Star, Euro, Plus, ArrowRight, Bell, Search } from "lucide-react";
import seaBackground from "@assets/image_1754575606863.png";

export default function DashboardScreen() {
  const userStats = {
    totalBookings: 12,
    totalSpent: 28500,
    upcomingTrips: 2,
    favoriteYachts: 8,
    shareValue: 125000,
    fuelWalletBalance: 1250
  };

  const upcomingBookings = [
    {
      id: "booking-1",
      yacht: "Serenity Princess",
      location: "Monaco, France",
      dates: "October 15-18, 2025",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "booking-2",
      yacht: "Ocean's Dream",
      location: "Ibiza, Spain",
      dates: "November 20-22, 2025",
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  const recentActivity = [
    {
      id: "activity-1",
      type: "booking",
      title: "Booking confirmed",
      description: "Serenity Princess for June 15-18",
      time: "2 hours ago",
      icon: Ship
    },
    {
      id: "activity-2",
      type: "investment",
      title: "Share purchase completed",
      description: "Azure Legend 1/8 share",
      time: "1 day ago",
      icon: TrendingUp
    },
    {
      id: "activity-3",
      type: "wallet",
      title: "Fuel wallet topped up",
      description: "Added €500 to wallet",
      time: "3 days ago",
      icon: Euro
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="relative px-4 py-6 overflow-hidden">
        {/* Turquoise Sea Background */}
        <div className="absolute inset-0 bg-gradient-ocean">
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${seaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7
          }} />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 to-blue-500/40" />
        </div>
        <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-700">Welcome back, John!</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-white/10 p-2">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-white/10 p-2 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{userStats.upcomingTrips}</p>
            <p className="text-gray-700 text-sm">Upcoming Trips</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">€{userStats.fuelWalletBalance.toLocaleString()}</p>
            <p className="text-gray-700 text-sm">Fuel Wallet</p>
          </div>
        </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Performance Overview */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Nauttec Journey</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Ship className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userStats.totalBookings}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Euro className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">€{userStats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">€{userStats.shareValue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Share Value</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userStats.favoriteYachts}</p>
                <p className="text-sm text-gray-600">Favorite Yachts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Trips */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Upcoming Trips</h3>
            <Link href="/my-bookings">
              <Button variant="ghost" className="text-primary font-semibold">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Link key={booking.id} href={`/reservation-detail/${booking.id}`}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex">
                      <img 
                        src={booking.image} 
                        alt={booking.yacht}
                        className="w-24 h-24 object-cover rounded-l-2xl"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{booking.yacht}</h4>
                            <p className="text-sm text-gray-600">{booking.location}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-gray-900">{booking.dates}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/home">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Ship className="w-6 h-6 mb-1" />
                  <span className="text-sm">Browse Yachts</span>
                </Button>
              </Link>
              <Link href="/ownership-opportunities">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <TrendingUp className="w-6 h-6 mb-1" />
                  <span className="text-sm">Invest in Shares</span>
                </Button>
              </Link>
              <Link href="/top-up">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-sm">Top Up Wallet</span>
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Users className="w-6 h-6 mb-1" />
                  <span className="text-sm">Messages</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" className="text-primary font-semibold">
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'booking' ? 'bg-blue-100' :
                        activity.type === 'investment' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          activity.type === 'booking' ? 'text-blue-600' :
                          activity.type === 'investment' ? 'text-green-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Investment Portfolio */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Investment Portfolio</h3>
              <Link href="/ownership-opportunities">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700">Total Portfolio Value</span>
                <span className="text-2xl font-bold text-green-900">€{userStats.shareValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+12.5% this year</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardContent className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended for You</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Ship className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">New yacht in Monaco</p>
                  <p className="text-sm text-gray-600">Perfect for your next trip</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Investment opportunity</p>
                  <p className="text-sm text-gray-600">1/6 share available in Greek Islands</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
