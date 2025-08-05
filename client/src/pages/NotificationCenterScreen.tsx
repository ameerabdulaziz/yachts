import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Ship, TrendingUp, MessageCircle, Calendar, Bell } from "lucide-react";

const mockNotifications = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your booking for Serenity Princess has been confirmed for October 15-18, 2025",
    time: "2 hours ago",
    read: false,
    icon: Ship
  },
  {
    id: "2",
    type: "ownership",
    title: "Share Purchase Complete",
    message: "You successfully purchased 1/8 share of Azure Legend for €45,000",
    time: "1 day ago",
    read: false,
    icon: TrendingUp
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    message: "Captain Laurent sent you a message about your upcoming trip",
    time: "2 days ago",
    read: true,
    icon: MessageCircle
  },
  {
    id: "4",
    type: "reminder",
    title: "Trip Reminder",
    message: "Your yacht trip starts in 3 days. Don't forget to pack!",
    time: "3 days ago",
    read: true,
    icon: Calendar
  }
];

export default function NotificationCenterScreen() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

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
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>
              )}
            </div>
          </div>
          <Button variant="ghost" className="text-primary font-semibold">
            Mark all read
          </Button>
        </div>
      </header>

      {/* Notification Types Filter */}
      <section className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          <Button variant="default" size="sm" className="bg-primary text-white whitespace-nowrap">
            All
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Bookings
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Ownership
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Messages
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Reminders
          </Button>
        </div>
      </section>

      {/* Notifications List */}
      <section className="px-4 py-6">
        <div className="space-y-3">
          {mockNotifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <Card key={notification.id} className={`cursor-pointer transition-all ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.type === 'booking' ? 'bg-blue-100' :
                      notification.type === 'ownership' ? 'bg-green-100' :
                      notification.type === 'message' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        notification.type === 'booking' ? 'text-blue-600' :
                        notification.type === 'ownership' ? 'text-green-600' :
                        notification.type === 'message' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Notification Settings */}
      <section className="px-4 py-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Notification Settings</h3>
                  <p className="text-sm text-gray-600">Manage your notification preferences</p>
                </div>
              </div>
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}
