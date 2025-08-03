import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Plus, Edit, Euro } from "lucide-react";

export default function BoatCalendarScreen() {
  const { id } = useParams<{ id: string }>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const yacht = {
    id: id || "yacht-1",
    name: "Serenity Princess",
    location: "Monaco, France"
  };

  // Mock calendar data
  const bookings = [
    { date: "2024-06-15", guest: "John D.", status: "confirmed", revenue: 2400 },
    { date: "2024-06-16", guest: "John D.", status: "confirmed", revenue: 2400 },
    { date: "2024-06-17", guest: "John D.", status: "confirmed", revenue: 2400 },
    { date: "2024-06-20", guest: "Sarah M.", status: "pending", revenue: 2400 },
    { date: "2024-06-21", guest: "Sarah M.", status: "pending", revenue: 2400 },
    { date: "2024-07-05", guest: "Available", status: "blocked", revenue: 0 },
    { date: "2024-07-06", guest: "Available", status: "blocked", revenue: 0 },
  ];

  const blockedDates = [
    { date: "2024-07-15", reason: "Maintenance" },
    { date: "2024-07-16", reason: "Maintenance" },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDateStatus = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const booking = bookings.find(b => b.date === dateString);
    const blocked = blockedDates.find(b => b.date === dateString);
    
    if (booking) return booking;
    if (blocked) return { ...blocked, status: 'maintenance' };
    return null;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.revenue, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/boat-management/${yacht.id}`}>
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Calendar</h1>
              <p className="text-sm text-gray-600">{yacht.name}</p>
            </div>
          </div>
          <Button className="bg-primary text-white">
            <Plus className="w-4 h-4 mr-1" />
            Block Dates
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Revenue Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Month Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-sm text-gray-600">Booked Days</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((bookings.filter(b => b.status === 'confirmed').length / 30) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Occupancy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) => {
                if (!date) {
                  return <div key={index} className="p-2 h-16"></div>;
                }

                const status = getDateStatus(date);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`p-2 h-16 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                      isToday ? 'border-primary bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {date.getDate()}
                    </div>
                    
                    {status && (
                      <div className="mt-1">
                        {status.status === 'confirmed' && (
                          <div className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs">
                            Booked
                          </div>
                        )}
                        {status.status === 'pending' && (
                          <div className="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded text-xs">
                            Pending
                          </div>
                        )}
                        {status.status === 'blocked' && (
                          <div className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs">
                            Blocked
                          </div>
                        )}
                        {status.status === 'maintenance' && (
                          <div className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs">
                            Maintenance
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span className="text-sm text-gray-700">Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 rounded"></div>
                <span className="text-sm text-gray-700">Blocked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span className="text-sm text-gray-700">Maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
              <Button variant="ghost" className="text-primary font-semibold">
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {bookings
                .filter(b => new Date(b.date) >= new Date() && b.status !== 'blocked')
                .slice(0, 3)
                .map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.guest}</p>
                    <p className="text-sm text-gray-600">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">€{booking.revenue}</p>
                    <Badge className={
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-sm">Block Dates</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <Euro className="w-6 h-6 mb-1" />
            <span className="text-sm">Update Pricing</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
