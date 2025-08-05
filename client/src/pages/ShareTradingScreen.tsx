import { ArrowLeft, TrendingUp, TrendingDown, Users, Clock, AlertCircle, UserCheck, Calendar, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Authentic De Antonio Yachts share listings
const mockShareListings = [
  {
    id: "listing-1",
    boatName: "De Antonio D42 Open",
    boatImage: "https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg",
    length: "12.64m",
    passengers: 12,
    cabins: 2,
    power: "1200HP",
    shareFraction: "1/8",
    sharePrice: "62,500",
    location: "El Gouna, Egypt",
    availableShares: 2,
    usageDaysPerYear: 45,
    engineHoursPerYear: 50,
    rightOfFirstRefusal: true,
    daysRemaining: 23,
    sellerName: "Owner #4",
    postedDate: "2025-01-15",
    waitlistCount: 3
  },
  {
    id: "listing-2",
    boatName: "De Antonio D32 Open",
    boatImage: "https://static.wixstatic.com/media/0fb4c8_6cbbd012fc0645009bc4a91a412b293a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D32.jpg",
    length: "9.90m",
    passengers: 10,
    cabins: 2,
    power: "600HP",
    shareFraction: "1/8",
    sharePrice: "50,000",
    location: "El Gouna, Egypt",
    availableShares: 1,
    usageDaysPerYear: 45,
    engineHoursPerYear: 50,
    rightOfFirstRefusal: false,
    daysRemaining: 0,
    sellerName: "Co-Owner",
    postedDate: "2025-01-20",
    waitlistCount: 1,
    publicListing: true
  },
  {
    id: "listing-3",
    boatName: "De Antonio D60",
    boatImage: "https://static.wixstatic.com/media/0fb4c8_b8a4fd5d6b40452fa36a2c12fe1c5b7b~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D60.jpg",
    length: "18.50m",
    passengers: 12,
    cabins: 3,
    power: "2000HP",
    shareFraction: "1/8",
    sharePrice: "125,000",
    location: "El Gouna, Egypt",
    availableShares: 1,
    usageDaysPerYear: 45,
    engineHoursPerYear: 50,
    rightOfFirstRefusal: true,
    daysRemaining: 15,
    sellerName: "Owner #2",
    postedDate: "2025-01-25",
    waitlistCount: 5
  },
  {
    id: "listing-4",
    boatName: "De Antonio D29",
    boatImage: "https://static.wixstatic.com/media/0fb4c8_2c6d2e89776645a6b4a6b38e8f5b5e5e~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D29.jpg",
    length: "8.50m",
    passengers: 8,
    cabins: 1,
    power: "400HP",
    shareFraction: "1/8",
    sharePrice: "37,500",
    location: "El Gouna, Egypt",
    availableShares: 3,
    usageDaysPerYear: 45,
    engineHoursPerYear: 50,
    rightOfFirstRefusal: false,
    daysRemaining: 0,
    sellerName: "Multiple Owners",
    postedDate: "2025-01-10",
    waitlistCount: 2,
    publicListing: true
  }
];

export default function ShareTradingScreen() {
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
          <h1 className="text-lg font-semibold text-gray-900">Share Trading</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Right of First Refusal Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Co-owners have 30 days right of first refusal on share sales before public listing.
          </AlertDescription>
        </Alert>

        {/* Available Share Listings */}
        <div className="space-y-4">
          {mockShareListings.map((listing) => (
            <Card key={listing.id} className="border border-gray-100 overflow-hidden">
              <div className="relative">
                <img
                  src={listing.boatImage}
                  alt={listing.boatName}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 right-2 space-y-1">
                  {listing.rightOfFirstRefusal && (
                    <Badge className="bg-blue-600 text-white block">
                      Co-Owners Only
                    </Badge>
                  )}
                  {listing.publicListing && (
                    <Badge className="bg-green-600 text-white block">
                      Public
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{listing.boatName}</h3>
                  <p className="text-sm text-gray-600">{listing.location}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{listing.length}</span>
                    <span>{listing.passengers} guests</span>
                    <span>{listing.cabins} cabins</span>
                    <span>{listing.power}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                    <UserCheck className="h-4 w-4 text-blue-600 mb-1" />
                    <span className="text-xs font-semibold">{listing.shareFraction}</span>
                    <span className="text-xs text-gray-600">Share</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600 mb-1" />
                    <span className="text-xs font-semibold">{listing.usageDaysPerYear}</span>
                    <span className="text-xs text-gray-600">Days/Year</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-orange-50 rounded-lg">
                    <Zap className="h-4 w-4 text-orange-600 mb-1" />
                    <span className="text-xs font-semibold">{listing.engineHoursPerYear}</span>
                    <span className="text-xs text-gray-600">Hours/Year</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                    <span className="text-xs font-semibold text-purple-600">${listing.sharePrice}</span>
                    <span className="text-xs text-gray-600">Price</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Shares</span>
                    <span className="font-medium">{listing.availableShares}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">
                      {new Date(listing.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                  {listing.rightOfFirstRefusal && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Days Remaining</span>
                      <span className="font-medium text-orange-600">
                        {listing.daysRemaining} days
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Waitlist</span>
                    <span className="font-medium">
                      <Users className="h-3 w-3 inline mr-1" />
                      {listing.waitlistCount}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {listing.rightOfFirstRefusal ? (
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Exercise Right
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Purchase Share
                    </Button>
                  )}
                  <Button variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sell Your Shares */}
        <Card className="border border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-orange-900">Sell Your Shares</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800 mb-4">
              List your shares for sale. Co-owners will be notified first with 30-day right of first refusal.
            </p>
            <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
              <TrendingDown className="h-4 w-4 mr-2" />
              List Share for Sale
            </Button>
          </CardContent>
        </Card>

        {/* Trading Rules */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Trading Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div>• Co-owners have 30-day right of first refusal on all share sales</div>
            <div>• Unused shares automatically go to public marketplace after waiting period</div>
            <div>• Join waitlists to be notified when shares become available</div>
            <div>• All transfers require Nauttec approval and documentation</div>
            <div>• Share prices are set by sellers, subject to market conditions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}