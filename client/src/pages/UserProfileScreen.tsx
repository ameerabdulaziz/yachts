import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Edit3, Star, Ship, TrendingUp, MessageCircle, Settings, LogOut, Camera } from "lucide-react";

export default function UserProfileScreen() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+33 123 456 789",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    joinDate: "Member since June 2023",
    rating: 4.8,
    totalBookings: 12,
    totalShares: 3
  };

  const menuItems = [
    { icon: Edit3, label: "Edit Profile", href: "/edit-profile" },
    { icon: Ship, label: "My Bookings", href: "/my-bookings" },
    { icon: TrendingUp, label: "My Investments", href: "/my-investments" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <section className="bg-gradient-ocean px-4 py-8 text-white">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl font-bold bg-gray-300 text-gray-700">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="sm"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-primary hover:bg-gray-100 p-0"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-blue-100 mb-1">{user.email}</p>
          <p className="text-blue-200 text-sm">{user.joinDate}</p>
          
          <div className="flex items-center justify-center space-x-1 mt-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-white ml-2">{user.rating} rating</span>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Ship className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{user.totalBookings}</p>
              <p className="text-sm text-gray-600">Yacht Trips</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{user.totalShares}</p>
              <p className="text-sm text-gray-600">Yacht Shares</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Menu Items */}
      <section className="px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900 flex-1">{item.label}</span>
                    <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Membership Status */}
      <section className="px-4 py-6">
        <Card className="bg-gradient-to-r from-amber-500 to-orange-600">
          <CardContent className="p-6 text-white text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-yellow-200" />
            <h3 className="text-xl font-bold mb-2">Premium Member</h3>
            <p className="text-orange-100 mb-4">Enjoy exclusive benefits and priority booking</p>
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              View Benefits
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Logout */}
      <section className="px-4 py-6">
        <Card>
          <CardContent className="p-4">
            <button className="w-full flex items-center justify-center space-x-3 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}
