import { ArrowLeft, Users, DollarSign, TrendingUp, TrendingDown, Calendar, MapPin, Ruler, Clock, Gauge } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "@/components/BottomNavigation";

// Mock data for boat ownership details
const mockBoatOwnership = {
  "yacht-1": {
    id: "yacht-1",
    name: "Saxdor 400 GTO",
    image: "https://static.wixstatic.com/media/0fb4c8_60988eb5cf834fcb876c1d06bd8af594~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D50.jpg",
    location: "El Gouna, Egypt",
    length: "50",
    capacity: 12,
    yearBuilt: 2026,
    description: "Premium luxury yacht with exceptional performance and comfort. Features advanced navigation systems and luxury finishes throughout.",
    amenities: ["Premium Outboards", "Advanced Navigation", "Luxury Finishes", "Master Cabin", "Outdoor Kitchen", "Premium Audio", "Flexiteek Decking", "Entertainment System"],
    sharesFractionOwned: "2/7",
    sharesPercentage: 28.6,
    shareValue: "€190,000",
    totalShares: 7,
    sharesOwned: 2,
    availableShares: 1,
    sharePrice: "€95,000",
    usageDaysPerYear: 35,
    remainingDays: 35,
    remainingEngineHours: 42,
    nextAvailableDate: "November 22, 2025",
    monthlyMaintenance: "€410",
    annualAppreciation: "+10.5%"
  },
  "yacht-4": {
    id: "yacht-4",
    name: "Saxdor 320 GTO",
    image: "https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg",
    location: "El Gouna, Egypt",
    length: "32",
    capacity: 10,
    yearBuilt: 2026,
    description: "Newest compact model with 2 × 300 HP V-8 Fourstroke engines. Features practical outdoor galley in center and three seats in pilot area with generous bench seating.",
    amenities: ["Dual 300HP V-8 Fourstroke", "Central Outdoor Galley", "Three Pilot Seats", "Generous Bench Seating", "650L Fuel Tank", "100L Freshwater", "80L Blackwater Tank", "CE Certification"],
    sharesFractionOwned: "2/7",
    sharesPercentage: 28.6,
    shareValue: "€160,000",
    totalShares: 7,
    sharesOwned: 2,
    availableShares: 2,
    sharePrice: "€80,000",
    usageDaysPerYear: 42,
    remainingDays: 38,
    remainingEngineHours: 45,
    nextAvailableDate: "October 15, 2025",
    monthlyMaintenance: "€260",
    annualAppreciation: "+8.2%"
  },
  "yacht-6": {
    id: "yacht-6", 
    name: "Saxdor 400 GTS",
    image: "https://static.wixstatic.com/media/0fb4c8_1105b00d73ee4ddc9f1ad1d4b74d9ece~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D60.jpg",
    location: "El Gouna, Egypt",
    length: "60",
    capacity: 12,
    yearBuilt: 2026,
    description: "The new flagship model with four hidden outboard engines and unmatched luxury. Available for 2026 delivery with customizable layout options and premium Barcelona craftsmanship.",
    amenities: ["Premium Hidden Outboards", "Master Suite", "VIP Cabin", "Outdoor Kitchen", "Premium Audio", "Advanced Navigation", "Flexiteek Decking", "Luxury Finishes"],
    sharesFractionOwned: "1/12",
    sharesPercentage: 8.3,
    shareValue: "€250,000",
    totalShares: 12,
    sharesOwned: 1,
    availableShares: 3,
    sharePrice: "€250,000",
    usageDaysPerYear: 23,
    remainingDays: 18,
    remainingEngineHours: 32,
    nextAvailableDate: "April 8, 2025",
    monthlyMaintenance: "€500",
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <Link href="/my-boats">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
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

          </div>
          
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{boat.name}</h2>
            
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

        {/* Book My Next Trip Button */}
        <Link href={`/booking-calendar/${boat.id}`}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4">
            View Yacht Calendar
          </Button>
        </Link>

        {/* Ownership Summary */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">My Ownership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="mb-2">
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto" />
                </div>
                <div className="text-xl font-bold text-gray-900">{boat.sharesOwned}/{boat.totalShares}</div>
                <div className="text-xs text-gray-600">My Shares</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="mb-2">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto" />
                </div>
                <div className="text-xl font-bold text-gray-900">{boat.remainingDays}</div>
                <div className="text-xs text-gray-600">Remaining Days</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="mb-2">
                  <Gauge className="h-6 w-6 text-blue-600 mx-auto" />
                </div>
                <div className="text-xl font-bold text-gray-900">{boat.remainingEngineHours}</div>
                <div className="text-xs text-gray-600">Engine Hours</div>
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

            </div>
          </CardContent>
        </Card>

        {/* Share Management Actions */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Manage My Shares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Available Shares</span>
                <span className="font-semibold">{boat.availableShares} of {boat.totalShares}</span>
              </div>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>Price per share:</span>
                <span className="font-semibold text-gray-900">${boat.sharePrice}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/share-trading">
                <Button 
                  variant="outline"
                  className="w-full"
                  disabled={boat.availableShares === 0}
                >
                  Buy More Shares
                </Button>
              </Link>
              <Link href="/list-share-for-sale">
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={boat.sharesOwned === 0}
                >
                  Sell Shares
                </Button>
              </Link>
            </div>

            {boat.availableShares === 0 && (
              <p className="text-xs text-gray-500 text-center">
                No shares currently available for purchase
              </p>
            )}
          </CardContent>
        </Card>


      </div>
      
      <BottomNavigation />
    </div>
  );
}