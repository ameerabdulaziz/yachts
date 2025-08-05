import { ArrowLeft, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

// Mock data for owned boats - limiting to 2 boats as requested
const mockOwnedBoats = [
  {
    id: "yacht-4",
    name: "De Antonio D32 Open",
    image: "https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg",
    location: "El Gouna, Egypt",
    length: "32",
    capacity: 10,
    yearBuilt: 2026,
    sharesFractionOwned: "2/7",
    sharesPercentage: 28.6,
    shareValue: "114,286",
    usageDaysPerYear: 96,
    nextAvailableDate: "March 15, 2025"
  },
  {
    id: "yacht-6",
    name: "De Antonio D60 Open",
    image: "https://static.wixstatic.com/media/0fb4c8_1105b00d73ee4ddc9f1ad1d4b74d9ece~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D60.jpg",
    location: "El Gouna, Egypt",
    length: "60",
    capacity: 12,
    yearBuilt: 2026,
    sharesFractionOwned: "1/12",
    sharesPercentage: 8.3,
    shareValue: "166,667",
    usageDaysPerYear: 27,
    nextAvailableDate: "April 8, 2025"
  }
];

export default function MyBoatsScreen() {
  const [, setLocation] = useLocation();

  const handleBoatClick = (boatId: string) => {
    setLocation(`/boat-ownership/${boatId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">My Boats</h1>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Portfolio Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">Boats Owned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">119</div>
              <div className="text-sm text-gray-600">Days/Year</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/share-marketplace">
            <Button variant="outline" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trade Shares
            </Button>
          </Link>
          <Button variant="outline" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Swap Days
          </Button>
        </div>

        {/* Owned Boats List */}
        <div className="space-y-4">
          {mockOwnedBoats.map((boat) => (
            <Card 
              key={boat.id} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
              onClick={() => handleBoatClick(boat.id)}
            >
              <div className="relative">
                <img
                  src={boat.image}
                  alt={boat.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {boat.sharesFractionOwned} Owned
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Boat Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{boat.name}</h3>
                    <p className="text-sm text-gray-600">{boat.location}</p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{boat.length} ft</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{boat.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Built {boat.yearBuilt}</span>
                    </div>
                  </div>

                  {/* Ownership Details */}
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Share Value</span>
                      <span className="text-sm font-semibold text-blue-600">${boat.shareValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Usage Days</span>
                      <span className="text-sm font-semibold text-gray-900">{boat.usageDaysPerYear}/year</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Next Available</span>
                      <span className="text-sm font-semibold text-gray-900">{boat.nextAvailableDate}</span>
                    </div>
                  </div>

                  {/* Action Buttons Preview */}
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 text-center">
                      <div className="text-xs text-gray-500">Tap to manage shares</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Message */}
        {mockOwnedBoats.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No boats owned yet</div>
            <p className="text-gray-500 text-sm mb-6">Start your yacht ownership journey today</p>
            <Link href="/ownership-opportunities">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Opportunities
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}