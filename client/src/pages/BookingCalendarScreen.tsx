import { ArrowLeft, Calendar, Clock, Users, Fuel, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BottomNavigation from "@/components/BottomNavigation";

// Mock booking calendar data based on Yachtak specification
const mockBookingCalendar = {
  "yacht-4": {
    ownerShares: 2,
    totalShares: 7,
    remainingDays: 34,
    remainingEngineHours: 38,
    fuelBalance: 45, // liters
    fuelThreshold: 20,
    // Generate calendar data for March 2025
    getDateStatus: (date: string) => {
      const dayOfMonth = new Date(date).getDate();
      // Mock different statuses for different days
      if ([3, 10, 17, 24, 31].includes(dayOfMonth)) return { status: "maintenance" };
      if ([5, 12, 16, 19, 26].includes(dayOfMonth)) return { status: "booked", bookedBy: dayOfMonth === 19 ? "You" : "Owner #3" };
      if ([21, 22].includes(dayOfMonth)) return { status: "waitlist", waitlistCount: 2 };
      return { status: "available" };
    }
  }
};

export default function BookingCalendarScreen() {
  const [match, params] = useRoute("/booking-calendar/:id");
  const boatId = params?.id;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<"morning" | "afternoon" | "full">("full");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025

  const bookingData = boatId ? mockBookingCalendar[boatId as keyof typeof mockBookingCalendar] : null;

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks x 7 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === month;
      const dayInfo = isCurrentMonth && bookingData ? bookingData.getDateStatus(dateStr) : { status: "unavailable" };
      
      days.push({
        date: new Date(current),
        dateStr,
        isCurrentMonth,
        day: current.getDate(),
        ...dayInfo
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Calendar not found</h2>
          <Link href="/my-boats">
            <Button variant="outline">Back to My Boats</Button>
          </Link>
        </div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();

  const canBook = bookingData.remainingDays > 0 && bookingData.remainingEngineHours > 0 && bookingData.fuelBalance > bookingData.fuelThreshold;

  const getStatusColor = (status: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return "bg-gray-100 text-gray-400";
    
    switch (status) {
      case "available": return "bg-green-500 text-white hover:bg-green-600 cursor-pointer";
      case "booked": return "bg-yellow-500 text-white";
      case "maintenance": return "bg-gray-400 text-white";
      case "waitlist": return "bg-orange-500 text-white";
      default: return "bg-gray-200 text-gray-600";
    }
  };

  const handleDateClick = (day: any) => {
    if (day.isCurrentMonth && day.status === "available" && canBook) {
      setSelectedDate(day.dateStr);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <Link href={`/boat-ownership/${boatId}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Booking Calendar</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Usage Summary */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Usage Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{bookingData.remainingDays}</div>
                <div className="text-xs text-gray-600">Days Left</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{bookingData.remainingEngineHours}</div>
                <div className="text-xs text-gray-600">Engine Hours</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{bookingData.fuelBalance}L</div>
                <div className="text-xs text-gray-600">Fuel Balance</div>
              </div>
            </div>
            
            {bookingData.fuelBalance <= bookingData.fuelThreshold && (
              <Alert className="border-orange-200">
                <Fuel className="h-4 w-4" />
                <AlertDescription>
                  Fuel balance is low. Top up before booking.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Calendar Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>Waitlist</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((dayName) => (
                <div key={dayName} className="text-center text-xs font-medium text-gray-500 p-2">
                  {dayName}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-colors
                    ${getStatusColor(day.status, day.isCurrentMonth)}
                    ${selectedDate === day.dateStr ? "ring-2 ring-blue-500" : ""}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  {day.day}
                </div>
              ))}
            </div>
            
            {/* Status info for selected date */}
            {selectedDate && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm">
                  <strong>Selected:</strong> {new Date(selectedDate).toLocaleDateString("en-US", { 
                    weekday: "long", 
                    month: "long", 
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Options */}
        {selectedDate && (
          <Card className="border border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Book {new Date(selectedDate).toLocaleDateString("en-US", { 
                  weekday: "long", 
                  month: "long", 
                  day: "numeric" 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedSlot === "morning" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSlot("morning")}
                  >
                    Morning
                  </Button>
                  <Button
                    variant={selectedSlot === "afternoon" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSlot("afternoon")}
                  >
                    Afternoon
                  </Button>
                  <Button
                    variant={selectedSlot === "full" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSlot("full")}
                  >
                    Full Day
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Clock className="h-4 w-4 mr-2" />
                  Book {selectedSlot === "full" ? "Full Day" : selectedSlot}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Share Booking
                </Button>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <div>• This will deduct 1 day and 1 engine hour from your balance</div>
                <div>• Cancellation within 48 hours will still deduct the day</div>
                <div>• No-shows result in penalty deductions</div>
              </div>
            </CardContent>
          </Card>
        )}

        {!canBook && (
          <Alert className="border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {bookingData.fuelBalance <= bookingData.fuelThreshold 
                ? "Top up fuel to enable bookings"
                : bookingData.remainingDays <= 0 
                ? "No remaining days in your allowance"
                : "No remaining engine hours in your allowance"}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}