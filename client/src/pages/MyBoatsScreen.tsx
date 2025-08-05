import { ArrowLeft, Users, DollarSign, TrendingUp, TrendingDown, Fuel, Calendar, Clock } from "lucide-react";
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
    remainingDays: 42,
    remainingEngineHours: 38
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
    remainingDays: 23,
    remainingEngineHours: 47
  }
];

export default function MyBoatsScreen() {
  const [, setLocation] = useLocation();

  const handleBoatClick = (boatId: string) => {
    setLocation(`/boat-ownership/${boatId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
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
        {/* Fuel Wallet */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 shadow-sm text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <Fuel className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Fuel Wallet</h2>
                <p className="text-blue-100 text-sm">Available balance</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">€2,450</div>
              <p className="text-blue-100 text-xs">≈ 980L fuel</p>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              Top Up
            </Button>
            <Button size="sm" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
              History
            </Button>
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
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Remaining Days</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{boat.remainingDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Engine Hours</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{boat.remainingEngineHours}h left</span>
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