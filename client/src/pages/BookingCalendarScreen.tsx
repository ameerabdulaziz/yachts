import { ArrowLeft, Calendar, Clock, Users, Fuel, AlertCircle } from "lucide-react";
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
    calendar: [
      { date: "2025-03-15", status: "available", multiplier: 1 },
      { date: "2025-03-16", status: "booked", bookedBy: "Owner #3", multiplier: 1 },
      { date: "2025-03-17", status: "available", multiplier: 1 },
      { date: "2025-03-18", status: "maintenance", multiplier: 0 },
      { date: "2025-03-19", status: "available", multiplier: 1 },
      { date: "2025-03-20", status: "available", multiplier: 2, holiday: "Spring Holiday" },
      { date: "2025-03-21", status: "waitlist", waitlistCount: 2, multiplier: 2 },
      { date: "2025-03-22", status: "available", multiplier: 1 },
      { date: "2025-03-23", status: "booked", bookedBy: "You", multiplier: 1 },
    ]
  }
};

export default function BookingCalendarScreen() {
  const [match, params] = useRoute("/booking-calendar/:id");
  const boatId = params?.id;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<"morning" | "afternoon" | "full">("full");

  const bookingData = boatId ? mockBookingCalendar[boatId as keyof typeof mockBookingCalendar] : null;

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

  const canBook = bookingData.remainingDays > 0 && bookingData.remainingEngineHours > 0 && bookingData.fuelBalance > bookingData.fuelThreshold;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "booked": return "bg-blue-100 text-blue-800 border-blue-200";
      case "maintenance": return "bg-gray-100 text-gray-800 border-gray-200";
      case "waitlist": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

        {/* Calendar */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              March 2025
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookingData.calendar.map((day) => (
              <div
                key={day.date}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedDate === day.date ? "ring-2 ring-blue-500" : ""
                } ${getStatusColor(day.status)} ${
                  day.status === "available" && canBook ? "cursor-pointer hover:opacity-80" : ""
                }`}
                onClick={() => {
                  if (day.status === "available" && canBook) {
                    setSelectedDate(day.date);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {new Date(day.date).toLocaleDateString("en-US", { 
                        weekday: "short", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </div>
                    {day.holiday && (
                      <div className="text-xs text-red-600 font-medium">{day.holiday}</div>
                    )}
                    {day.bookedBy && (
                      <div className="text-xs opacity-70">Booked by {day.bookedBy}</div>
                    )}
                    {day.waitlistCount && (
                      <div className="text-xs opacity-70">Waitlist: {day.waitlistCount} people</div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {day.status === "maintenance" ? "Maintenance" : 
                       day.status === "booked" ? "Booked" :
                       day.status === "waitlist" ? "Join Waitlist" : 
                       "Available"}
                    </Badge>
                    {day.multiplier > 1 && (
                      <div className="text-xs text-red-600 font-medium mt-1">
                        {day.multiplier}x Engine Hours
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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