import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Download, Share } from "lucide-react";
import { mockYachts } from "@/lib/mockData";
import BottomNavigation from "@/components/BottomNavigation";
import seaBackground from "@assets/image_1754575606863.png";
import { parseCurrency } from "@/lib/utils";

export default function BookingConfirmationScreen() {
  // Parse URL parameters to get booking details
  const urlParams = new URLSearchParams(window.location.search);
  const yachtId = urlParams.get('yacht');
  const startDate = urlParams.get('start');
  const endDate = urlParams.get('end');
  const catering = urlParams.get('catering') === 'true';
  const fromMyBoats = urlParams.get('owner') === 'true';
  
  // Find yacht details
  const yacht = mockYachts.find(y => y.id === yachtId) || mockYachts[0];
  
  // Calculate booking details
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "October 15, 2025";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const calculateTotal = () => {
    if (fromMyBoats) return 0; // Owner booking - no cost
    if (!startDate || !endDate) return 2400;
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const basePrice = parseCurrency(yacht.pricePerDay) * days;
    const cateringPrice = catering ? 200 * days : 0;
    const serviceFee = Math.round((basePrice + cateringPrice) * 0.05);
    return basePrice + cateringPrice + serviceFee;
  };
  
  const booking = {
    id: "booking-12345",
    yachtName: yacht.name,
    location: yacht.location,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    guests: yacht.capacity,
    totalPrice: calculateTotal(),
    captain: "Captain Laurent",
    captainPhone: "+33 6 12 34 56 78",
    captainEmail: "laurent@nauttec.com",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    isOwnedBooking: fromMyBoats,
    hasCatering: catering
  };
  
  const handleShareWhatsApp = () => {
    const message = `🛥️ Yacht Booking Confirmed!

📅 ${booking.yachtName}
📍 ${booking.location}
🗓️ ${booking.startDate} - ${booking.endDate}
👥 ${booking.guests} guests
🧑‍✈️ Captain: ${booking.captain}
${booking.hasCatering ? '🍽️ Catering included\n' : ''}
Booking Reference: ${booking.id.toUpperCase()}

Excited for this luxury yacht experience! 🌊`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Success Header */}
      <section className="relative px-4 py-12 text-center overflow-hidden">
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">{booking.yachtName} Confirmed!</h1>
            <p className="text-gray-600">{booking.isOwnedBooking ? 'Your yacht is ready for your trip' : 'Your luxury yacht experience awaits'}</p>
          </div>
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

        {/* Total Paid / Owner Booking */}
        <Card>
          <CardContent className="p-4 bg-green-50">
            <div className="text-center">
              {booking.isOwnedBooking ? (
                <>
                  <p className="text-sm text-gray-600 mb-1">Owner's Booking</p>
                  <p className="text-3xl font-bold text-green-600">Complimentary</p>
                  <p className="text-sm text-gray-600 mt-1">No charge for yacht owner{booking.hasCatering ? ' • Catering included' : ''}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-green-600">€{booking.totalPrice.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Payment successful{booking.hasCatering ? ' • Catering included' : ''}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
            <Download className="w-5 h-5 mr-2" />
            Download Booking Confirmation
          </Button>
          
          <Button 
            onClick={handleShareWhatsApp}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700"
          >
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
            <Button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              View All Bookings
            </Button>
          </Link>
          <Link href="/home">
            <Button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
