import { ArrowLeft, TrendingUp, TrendingDown, Users, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock share trading data based on Yachtak specification
const mockShareListings = [
  {
    id: "listing-1",
    boatName: "De Antonio D42 Open",
    boatImage: "https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg",
    shareFraction: "1/7",
    sharePrice: "71,429",
    location: "El Gouna, Egypt",
    usageDaysPerYear: 48,
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
    shareFraction: "2/7",
    sharePrice: "114,286",
    location: "El Gouna, Egypt",
    usageDaysPerYear: 96,
    rightOfFirstRefusal: false,
    daysRemaining: 0,
    sellerName: "Co-Owner",
    postedDate: "2025-01-20",
    waitlistCount: 1,
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
        {/* Trading Overview */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Share Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">2</div>
                <div className="text-sm text-gray-600">Available Shares</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">People Waiting</div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {listing.shareFraction}
                  </Badge>
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
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Share Price</span>
                    <div className="font-semibold text-lg">${listing.sharePrice}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Usage Days</span>
                    <div className="font-semibold">{listing.usageDaysPerYear}/year</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seller</span>
                    <span className="font-medium">{listing.sellerName}</span>
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