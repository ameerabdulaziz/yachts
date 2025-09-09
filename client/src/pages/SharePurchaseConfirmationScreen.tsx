import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Calendar, MapPin, Download, Share, Star } from "lucide-react";

export default function SharePurchaseConfirmationScreen() {
  const { id } = useParams<{ id: string }>();
  
  const purchase = {
    id: id || "purchase-12345",
    yacht: {
      name: "Azure Legend",
      location: "French Riviera",
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    shareFraction: "1/8",
    sharesPurchased: 1,
    purchasePrice: 48000,
    usageDaysPerYear: 40,
    purchaseDate: new Date().toLocaleDateString(),
    expectedRoi: "5-7%",
    nextUsageStart: "June 2024"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <section className="bg-gradient-ocean px-4 py-12 text-white text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Investment Confirmed!</h1>
        <p className="text-blue-100">Welcome to yacht ownership</p>
      </section>

      <div className="p-4 space-y-6">
        {/* Investment Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <img 
                src={purchase.yacht.image}
                alt={purchase.yacht.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900 mb-1">{purchase.yacht.name}</h2>
              <p className="text-gray-600">{purchase.yacht.location}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Share Purchased</p>
                  <p className="text-gray-700">{purchase.shareFraction} ownership share</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900">Annual Usage</p>
                  <p className="text-gray-700">{purchase.usageDaysPerYear} days per year</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Home Marina</p>
                  <p className="text-gray-700">Port Hercule, Monaco</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Purchase Date</span>
                <span className="font-medium">{purchase.purchaseDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Shares Purchased</span>
                <span className="font-medium">{purchase.sharesPurchased}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Share Fraction</span>
                <span className="font-medium">{purchase.shareFraction}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Expected ROI</span>
                <span className="font-medium text-green-600">{purchase.expectedRoi}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Investment</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">€{purchase.purchasePrice.toLocaleString()}</span>
                    <p className="text-xs text-blue-600 font-medium">from €{Math.round(purchase.purchasePrice / 60).toLocaleString()} monthly</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Reference */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Investment Reference</p>
              <p className="text-2xl font-bold text-gray-900 tracking-wider">{purchase.id.toUpperCase()}</p>
              <p className="text-sm text-gray-500 mt-2">Keep this reference for your records</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Legal Documentation</p>
                  <p className="text-sm text-gray-600">Your ownership documents will be processed within 5-7 business days</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Usage Schedule</p>
                  <p className="text-sm text-gray-600">Your {purchase.usageDaysPerYear} days will be allocated for {purchase.nextUsageStart}</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Owner Orientation</p>
                  <p className="text-sm text-gray-600">Schedule your yacht orientation with the management team</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Owner Benefits */}
        <Card>
          <CardContent className="p-4 bg-gradient-to-r from-amber-50 to-orange-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🎉 Owner Benefits Unlocked</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Full management and maintenance included</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Free days abroad through dealer partner network</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Priority booking for additional weeks</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Owner-only events and gatherings</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Concierge services for your trips</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Rental income when not using your weeks</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold">
            <Download className="w-5 h-5 mr-2" />
            Download Investment Certificate
          </Button>
          
          <Button variant="outline" className="w-full py-3 rounded-xl font-semibold">
            <Share className="w-5 h-5 mr-2" />
            Share Your Investment
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/ownership-opportunities">
            <Button variant="outline" className="w-full py-3 rounded-xl font-semibold">
              View Portfolio
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
