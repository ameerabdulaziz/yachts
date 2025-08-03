import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, Calendar, UserCheck, Utensils, CreditCard, Fuel, Minus, Plus } from "lucide-react";
import { mockYachts } from "@/lib/mockData";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BookingCheckoutScreen() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState("2024-06-15");
  const [endDate, setEndDate] = useState("2024-06-18");
  const [guestCount, setGuestCount] = useState(6);
  const [addCaptain, setAddCaptain] = useState(false);
  const [addCatering, setAddCatering] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Find yacht by ID
  const yacht = mockYachts.find(y => y.id === id) || mockYachts[0];

  const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const basePrice = Number(yacht.pricePerDay) * days;
  const captainPrice = addCaptain ? 200 * days : 0;
  const cateringPrice = addCatering ? 150 * days : 0;
  const serviceFee = Math.round((basePrice + captainPrice + cateringPrice) * 0.05);
  const totalPrice = basePrice + captainPrice + cateringPrice + serviceFee;

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your yacht booking has been successfully confirmed.",
      });
      setLocation("/booking-confirmation");
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const handleBooking = () => {
    const bookingData = {
      yachtId: yacht.id,
      userId: "user-1", // In real app, get from auth context
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guestCount,
      totalPrice: totalPrice.toString(),
      status: "confirmed",
      addOns: { captain: addCaptain, catering: addCatering },
      paymentMethod
    };
    
    bookingMutation.mutate(bookingData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link href={`/yacht-details/${yacht.id}`}>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Book {yacht.name}</h1>
        </div>
      </header>

      {/* Yacht Summary */}
      <section className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex space-x-4">
          <img 
            src={yacht.images[0]} 
            alt={yacht.name}
            className="w-20 h-20 object-cover rounded-xl"
          />
          <div className="flex-1">
            <h2 className="font-bold text-gray-900">{yacht.name}</h2>
            <p className="text-gray-600 text-sm">{yacht.location}</p>
            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
              <span><Users className="w-4 h-4 inline mr-1" />{yacht.capacity} guests</span>
              <span>€{yacht.pricePerDay}/day</span>
            </div>
          </div>
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Date Selection */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Calendar className="w-5 h-5 inline mr-2" />
              Select Dates
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Check-in</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">Check-out</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{days} days selected</p>
          </CardContent>
        </Card>

        {/* Guest Count */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Users className="w-5 h-5 inline mr-2" />
              Guests
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">Number of guests</span>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold text-lg w-8 text-center">{guestCount}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setGuestCount(Math.min(yacht.capacity, guestCount + 1))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Maximum {yacht.capacity} guests</p>
          </CardContent>
        </Card>

        {/* Add-ons */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-ons</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">Professional Captain</p>
                    <p className="text-sm text-gray-600">Licensed and experienced</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">€200/day</span>
                  <Checkbox
                    checked={addCaptain}
                    onCheckedChange={setAddCaptain}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Utensils className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">Catering Service</p>
                    <p className="text-sm text-gray-600">Gourmet meals and drinks</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">€150/day</span>
                  <Checkbox
                    checked={addCatering}
                    onCheckedChange={setAddCatering}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card>
          <CardContent className="p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">€{yacht.pricePerDay} × {days} days</span>
                <span className="font-medium">€{basePrice.toLocaleString()}</span>
              </div>
              {addCaptain && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Captain ({days} days)</span>
                  <span className="font-medium">€{captainPrice.toLocaleString()}</span>
                </div>
              )}
              {addCatering && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Catering ({days} days)</span>
                  <span className="font-medium">€{cateringPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Service fee</span>
                <span className="font-medium">€{serviceFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-primary">€{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="fuel-wallet" id="fuel-wallet" />
                <Fuel className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <Label htmlFor="fuel-wallet" className="font-medium text-gray-900">Fuel Wallet</Label>
                  <p className="text-sm text-gray-600">Balance: €1,250</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <Label htmlFor="credit-card" className="font-medium text-gray-900">Credit Card</Label>
                  <p className="text-sm text-gray-600">•••• •••• •••• 4532</p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button 
          onClick={handleBooking}
          disabled={bookingMutation.isPending}
          className="w-full bg-gradient-ocean text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
        >
          {bookingMutation.isPending ? "Processing..." : `Confirm Booking - €${totalPrice.toLocaleString()}`}
        </Button>
      </div>
    </div>
  );
}
