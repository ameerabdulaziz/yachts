import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, User, Ship, Wallet, Bell, MessageCircle, Calendar, Settings } from "lucide-react";

const screenCategories = [
  {
    title: "Authentication & Onboarding",
    icon: User,
    screens: [
      { name: "Splash Screen", route: "/", description: "App loading screen with branding" },
      { name: "Phone Login", route: "/login", description: "Phone number authentication" },
      { name: "OTP Verification", route: "/verify-otp", description: "SMS code verification" },
      { name: "Account Setup", route: "/account-setup", description: "Complete user profile" },
    ]
  },
  {
    title: "Main Navigation",
    icon: Smartphone,
    screens: [
      { name: "Home Screen", route: "/home", description: "Browse yachts and main dashboard" },
      { name: "Dashboard", route: "/dashboard", description: "User activity overview" },
      { name: "User Profile", route: "/profile", description: "Personal profile management" },
      { name: "Edit Profile", route: "/edit-profile", description: "Update personal information" },
      { name: "Settings", route: "/settings", description: "App preferences and configuration" },
    ]
  },
  {
    title: "Yacht Booking",
    icon: Ship,
    screens: [
      { name: "Yacht Details", route: "/yacht-details/1", description: "Detailed yacht information" },
      { name: "Booking Checkout", route: "/booking/1", description: "Complete yacht reservation" },
      { name: "Booking Confirmation", route: "/booking-confirmation", description: "Booking success screen" },
      { name: "My Bookings", route: "/my-bookings", description: "View all reservations" },
      { name: "Reservation Detail", route: "/reservation-detail/1", description: "Individual booking details" },
    ]
  },
  {
    title: "Yacht Ownership",
    icon: Ship,
    screens: [
      { name: "Ownership Opportunities", route: "/ownership-opportunities", description: "Available yacht shares" },
      { name: "Yacht Ownership Detail", route: "/ownership/1", description: "Detailed ownership info" },
      { name: "Ownership Inquiry", route: "/ownership-inquiry/1", description: "Request ownership information" },
      { name: "Share Marketplace", route: "/share-marketplace", description: "Buy/sell yacht shares" },
      { name: "Share Listing Detail", route: "/share-listing/1", description: "Individual share listing" },
      { name: "Share Purchase Confirmation", route: "/share-purchase-confirmation/1", description: "Share purchase success" },
      { name: "List Share For Sale", route: "/list-share-for-sale", description: "Sell your yacht shares" },
    ]
  },
  {
    title: "Owner Management",
    icon: Settings,
    screens: [
      { name: "Owner Dashboard", route: "/owner-dashboard", description: "Yacht owner control panel" },
      { name: "Boat Management", route: "/boat-management/1", description: "Manage owned yachts" },
      { name: "Add Boat Listing", route: "/add-boat-listing", description: "List new yacht for rental" },
      { name: "Boat Calendar", route: "/boat-calendar/1", description: "Manage yacht availability" },
      { name: "Waitlist Management", route: "/waitlist-management", description: "Handle booking requests" },
    ]
  },
  {
    title: "Financial",
    icon: Wallet,
    screens: [
      { name: "Fuel Wallet", route: "/fuel-wallet", description: "Virtual currency balance" },
      { name: "Top Up", route: "/top-up", description: "Add funds to wallet" },
    ]
  },
  {
    title: "Communication",
    icon: MessageCircle,
    screens: [
      { name: "Messaging Center", route: "/messages", description: "All conversations" },
      { name: "Chat Thread", route: "/chat/1", description: "Individual conversation" },
      { name: "Notification Center", route: "/notifications", description: "App notifications" },
    ]
  }
];

export default function DevNavigationScreen() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/home">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nauttec - All Screens</h1>
            <p className="text-gray-600">Navigate through all {screenCategories.reduce((total, cat) => total + cat.screens.length, 0)} app screens</p>
          </div>
        </div>

        <div className="grid gap-6">
          {screenCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    {category.title}
                    <span className="text-sm font-normal text-gray-500">
                      ({category.screens.length} screens)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.screens.map((screen) => (
                      <Link key={screen.route} href={screen.route}>
                        <div className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all cursor-pointer group">
                          <h3 className="font-medium text-gray-900 group-hover:text-primary">
                            {screen.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {screen.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2 font-mono">
                            {screen.route}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Navigation Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click any screen card to navigate directly to that screen</li>
            <li>• Use the bottom navigation bar when available</li>
            <li>• Some screens may require specific data or authentication</li>
            <li>• Return to this page anytime via the URL: /dev-navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}