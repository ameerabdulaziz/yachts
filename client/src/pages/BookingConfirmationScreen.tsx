import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Download, Share } from "lucide-react";

export default function BookingConfirmationScreen() {
  const booking = {
    id: "booking-12345",
    yachtName: "Serenity Princess",
    location: "Monaco, France",
    startDate: "October 15, 2025",
    endDate: "October 18, 2025",
    guests: 6,
    totalPrice: 8190,
    captain: "Captain Laurent",
    captainPhone: "+33 6 12 34 56 78",
    captainEmail: "laurent@nauttec.com",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <section className="relative px-4 py-12 text-white text-center overflow-hidden">
        {/* Turquoise Sea Background */}
        <div className="absolute inset-0 bg-gradient-ocean">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8
          }} />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 to-blue-500/40" />
        </div>
        <div className="relative z-10">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-blue-100">Your luxury yacht experience awaits</p>
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Booking Details */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{booking.yachtName}</h2>
              <p className="text-gray-600">{booking.location}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900">Trip Dates</p>
                  <p className="text-gray-700">{booking.startDate} - {booking.endDate}</p>
                  <p className="text-sm text-gray-600">Check-in: {booking.checkInTime} • Check-out: {booking.checkOutTime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Guest Count</p>
                  <p className="text-gray-700">{booking.guests} guests</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Marina Location</p>
                  <p className="text-gray-700">Port Hercule, Monaco</p>
                  <p className="text-sm text-gray-600">Berth 45, Section A</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Reference */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
              <p className="text-2xl font-bold text-gray-900 tracking-wider">{booking.id.toUpperCase()}</p>
              <p className="text-sm text-gray-500 mt-2">Keep this reference for your records</p>
            </div>
          </CardContent>
        </Card>

        {/* Captain Contact */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Captain</h3>
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                alt={booking.captain}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{booking.captain}</h4>

                <div className="flex text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle key={i} className="w-3 h-3" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-700">{booking.captainPhone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-700">{booking.captainEmail}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Paid */}
        <Card>
          <CardContent className="p-4 bg-green-50">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Paid</p>
              <p className="text-3xl font-bold text-green-600">€{booking.totalPrice.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Payment successful</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold">
            <Download className="w-5 h-5 mr-2" />
            Download Booking Confirmation
          </Button>
          
          <Button variant="outline" className="w-full py-3 rounded-xl font-semibold">
            <Share className="w-5 h-5 mr-2" />
            Share Trip Details
          </Button>
        </div>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>You'll receive a detailed itinerary 48 hours before departure</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Captain Laurent will contact you 24 hours before your trip</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Arrive at the marina 30 minutes before departure</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/my-bookings">
            <Button variant="outline" className="w-full py-3 rounded-xl font-semibold">
              View All Bookings
            </Button>
          </Link>
          <Link href="/home">
            <Button className="w-full bg-gradient-ocean text-white py-3 rounded-xl font-semibold">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
