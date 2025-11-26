import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, MapPin, Phone, Mail, MessageCircle, Download, CreditCard, AlertCircle } from "lucide-react";
import deAntonioD50 from "@assets/image_1754579474724.png";
import BottomNavigation from "@/components/BottomNavigation";

export default function ReservationDetailScreen() {
  const { id } = useParams<{ id: string }>();
  
  const booking = {
    id: id || "booking-1",
    status: "confirmed" as const,
    yacht: {
      name: "De Antonio D50 Open",
      location: "El Gouna, Egypt",
      image: deAntonioD50
    },
    startDate: new Date("2025-10-15"),
    endDate: new Date("2025-10-18"),
    guestCount: 6,
    totalPrice: 8190,
    paymentMethod: "Credit Card",
    addOns: {
      captain: true,
      catering: false
    },
    captain: {
      name: "Captain Laurent",
      phone: "+33 6 12 34 56 78",
      email: "laurent@nauttec.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    marina: {
      name: "Port Hercule",
      address: "Monaco, Monte Carlo",
      berth: "Berth 45, Section A"
    },
    checkIn: "2:00 PM",
    checkOut: "11:00 AM"
  };

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800"
  };

  const isUpcoming = booking.startDate > new Date();
  const isPast = booking.startDate <= new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/my-bookings">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Reservation Details</h1>
          </div>
          <Badge className={statusColors[booking.status]}>
            {booking.status}
          </Badge>
        </div>
      </header>

      {/* Yacht Image */}
      <section className="relative">
        <img 
          src={booking.yacht.image} 
          alt={booking.yacht.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
          <div className="p-4 text-white">
            <h2 className="text-2xl font-bold">{booking.yacht.name}</h2>
            <p className="text-blue-100">{booking.yacht.location}</p>
          </div>
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Booking Reference */}
        <Card>
          <CardContent className="p-4 text-center bg-gradient-ocean text-white">
            <p className="text-sm text-blue-100 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold tracking-wider">{booking.id.toUpperCase()}</p>
          </CardContent>
        </Card>

        {/* Trip Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900">Duration</p>
                  <p className="text-gray-700">{booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Check-in: {booking.checkIn} • Check-out: {booking.checkOut}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Guests</p>
                  <p className="text-gray-700">{booking.guestCount} guests</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Marina</p>
                  <p className="text-gray-700">{booking.marina.name}</p>
                  <p className="text-sm text-gray-600">{booking.marina.address}</p>
                  <p className="text-sm text-gray-600">{booking.marina.berth}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add-ons */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-ons</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Professional Captain</span>
                <Badge variant={booking.addOns.captain ? "default" : "secondary"}>
                  {booking.addOns.captain ? "Included" : "Not included"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Catering Service</span>
                <Badge variant={booking.addOns.catering ? "default" : "secondary"}>
                  {booking.addOns.catering ? "Included" : "Not included"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Captain Contact */}
        {booking.addOns.captain && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Captain</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={booking.captain.avatar} 
                  alt={booking.captain.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{booking.captain.name}</h4>

                </div>
              </div>
              

            </CardContent>
          </Card>
        )}

        {/* Payment Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Payment Method</span>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{booking.paymentMethod}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Paid</span>
                <span className="text-xl font-bold text-green-600">€{booking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <AlertCircle className="w-4 h-4" />
                <span>Payment confirmed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isUpcoming && (
            <>
              <Button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Captain
              </Button>
              
              <Button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
                <Download className="w-5 h-5 mr-2" />
                Download Itinerary
              </Button>
            </>
          )}
          
          {isPast && (
            <Button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              Leave a Review
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              Download Receipt
            </Button>
            <Button className="bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700">
              Cancel Booking
            </Button>
          </div>
        </div>

        {/* Important Notes */}
        <Card>
          <CardContent className="p-4 bg-amber-50">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Important Notes</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Arrive at the marina 30 minutes before departure</li>
                  <li>• Bring valid ID and confirmation email</li>
                  <li>• Weather conditions may affect the itinerary</li>
                  <li>• Cancellation policy: 48 hours notice required</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
