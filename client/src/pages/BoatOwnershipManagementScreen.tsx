import { ArrowLeft, Users, DollarSign, TrendingUp, TrendingDown, Calendar, MapPin, Ruler } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "@/components/BottomNavigation";

// Mock data for boat ownership details
const mockBoatOwnership = {
  "yacht-4": {
    id: "yacht-4",
    name: "De Antonio D32 Open",
    image: "https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg",
    location: "El Gouna, Egypt",
    length: "32",
    capacity: 10,
    yearBuilt: 2026,
    description: "Newest compact model with 2 × 300 HP V-8 Fourstroke engines. Features practical outdoor galley in center and three seats in pilot area with generous bench seating.",
    amenities: ["Dual 300HP V-8 Fourstroke", "Central Outdoor Galley", "Three Pilot Seats", "Generous Bench Seating", "650L Fuel Tank", "100L Freshwater", "80L Blackwater Tank", "CE Certification"],
    sharesFractionOwned: "2/7",
    sharesPercentage: 28.6,
    shareValue: "114,286",
    totalShares: 7,
    sharesOwned: 2,
    availableShares: 2,
    sharePrice: "57,143",
    usageDaysPerYear: 96,
    nextAvailableDate: "October 15, 2025",
    monthlyMaintenance: "180",
    annualAppreciation: "+8.2%"
  },
  "yacht-6": {
    id: "yacht-6", 
    name: "De Antonio D60 Open",
    image: "https://static.wixstatic.com/media/0fb4c8_1105b00d73ee4ddc9f1ad1d4b74d9ece~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D60.jpg",
    location: "El Gouna, Egypt",
    length: "60",
    capacity: 12,
    yearBuilt: 2026,
    description: "The new flagship model with four hidden outboard engines and unmatched luxury. Available for 2026 delivery with customizable layout options and premium Barcelona craftsmanship.",
    amenities: ["Premium Hidden Outboards", "Master Suite", "VIP Cabin", "Outdoor Kitchen", "Premium Audio", "Advanced Navigation", "Flexiteek Decking", "Luxury Finishes"],
    sharesFractionOwned: "1/12",
    sharesPercentage: 8.3,
    shareValue: "166,667",
    totalShares: 12,
    sharesOwned: 1,
    availableShares: 3,
    sharePrice: "166,667",
    usageDaysPerYear: 27,
    nextAvailableDate: "April 8, 2025",
    monthlyMaintenance: "350",
    annualAppreciation: "+12.1%"
  }
};

export default function BoatOwnershipManagementScreen() {
  const [match, params] = useRoute("/boat-ownership/:id");
  const boatId = params?.id;
  const boat = boatId ? mockBoatOwnership[boatId as keyof typeof mockBoatOwnership] : null;

  if (!boat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Boat not found</h2>
          <Link href="/my-boats">
            <Button variant="outline">Back to My Boats</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <Link href="/my-boats">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Ownership Details</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Boat Image & Basic Info */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative">
            <img
              src={boat.image}
              alt={boat.name}
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                {boat.sharesFractionOwned} Owned
              </Badge>
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{boat.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{boat.description}</p>
            
            {/* Specs */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{boat.length} ft</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{boat.capacity} guests</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{boat.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership Summary */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Ownership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{boat.sharesOwned}</div>
                <div className="text-sm text-gray-600">Shares Owned</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{boat.usageDaysPerYear}</div>
                <div className="text-sm text-gray-600">Days/Year</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Share Value</span>
                <span className="font-semibold">${boat.shareValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Maintenance</span>
                <span className="font-semibold">${boat.monthlyMaintenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Appreciation</span>
                <span className="font-semibold text-green-600">{boat.annualAppreciation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Available</span>
                <span className="font-semibold">{boat.nextAvailableDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Management Actions */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Manage Your Shares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Available Shares</span>
                <span className="font-semibold">{boat.availableShares} of {boat.totalShares}</span>
              </div>
              <div className="text-sm text-gray-600">
                Price per share: <span className="font-semibold text-gray-900">${boat.sharePrice}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                disabled={boat.availableShares === 0}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Buy More Shares
              </Button>
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50"
                disabled={boat.sharesOwned === 0}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Sell Shares
              </Button>
            </div>

            {boat.availableShares === 0 && (
              <p className="text-xs text-gray-500 text-center">
                No shares currently available for purchase
              </p>
            )}
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Boat Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {boat.amenities.map((amenity, index) => (
                <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  {amenity}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link href={`/yacht/${boat.id}`}>
            <Button variant="outline" className="w-full">
              View Full Details
            </Button>
          </Link>
          <Link href={`/booking-calendar/${boat.id}`}>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Book Usage
            </Button>
          </Link>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}