import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Edit3, Star, Ship, PieChart, MessageCircle, Settings, LogOut, Camera, Crown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import seaBackground from "@assets/image_1754575606863.png";

export default function UserProfileScreen() {
  const [, navigate] = useLocation();

  // Fetch user data from API 
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      // Redirect to login page after successful logout
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still redirect to login even if logout API fails
      navigate("/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Type assertion and use first user as current user or fallback data
  const apiUsers = users as any[];
  const user = apiUsers.length > 0 ? {
    name: `${apiUsers[0].firstName} ${apiUsers[0].lastName}`,
    email: apiUsers[0].email,
    phone: apiUsers[0].phone,
    avatar: apiUsers[0].profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    joinDate: "Member since June 2023",
    rating: 4.8,
    totalBookings: 12,
    totalShares: apiUsers[0].role === 'owner' || apiUsers[0].role === 'both' ? 3 : 0,
    fuelBalance: apiUsers[0].fuelWalletBalance || '0.00'
  } : {
    name: "Mohamed Hassan",
    email: "mohamed.hassan@nauttec.com",
    phone: "+33 123 456 789",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    joinDate: "Member since June 2023",
    rating: 4.8,
    totalBookings: 12,
    totalShares: 3,
    fuelBalance: '2500.00'
  };

  const menuItems = [
    { icon: Edit3, label: "Edit Profile", href: "/edit-profile" },
    { icon: Ship, label: "My Bookings", href: "/my-bookings" },
    { icon: PieChart, label: "My Investments", href: "/my-investments" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
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
          <div className="bg-white rounded-2xl p-6 mx-4 shadow-xl text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-24 h-24 border-4 border-gray-100">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl font-bold bg-gray-300 text-gray-700">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-2xl font-bold mb-1 text-gray-900">{user.name}</h2>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <p className="text-gray-500 text-sm">{user.joinDate}</p>
            
            <div className="flex items-center justify-center space-x-1 mt-3">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-gray-700 ml-2">{user.rating} rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="px-4 py-6">
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <Ship className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">{user.totalBookings}</p>
              <p className="text-xs text-gray-600">Yacht Trips</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <PieChart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">{user.totalShares}</p>
              <p className="text-xs text-gray-600">Yacht Shares</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Crown className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">Owner</p>
              <p className="text-xs text-gray-600">Yacht Owner</p>
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
            <button 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center justify-center space-x-3 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">
                {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
              </span>
            </button>
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}
