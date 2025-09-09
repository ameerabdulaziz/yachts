import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function InquiryThankYouScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            Thank You!
          </h1>
          
          <p className="text-gray-600 mb-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
            We have received your investment inquiry. A Nauttec team member will get in touch with you soon to discuss your yacht ownership opportunity.
          </p>
          
          <div className="space-y-3">
            <Link href="/ownership-opportunities">
              <Button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Browse More Opportunities
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full py-3 rounded-xl font-semibold">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}