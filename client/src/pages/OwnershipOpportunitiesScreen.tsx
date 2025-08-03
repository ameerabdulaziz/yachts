import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Calendar, MapPin, TrendingUp, Filter } from "lucide-react";
import { mockOwnershipOpportunities } from "@/lib/mockData";

export default function OwnershipOpportunitiesScreen() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Ownership Opportunities</h1>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <Filter className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-ocean px-4 py-8 text-white">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold mb-2">Fractional Yacht Ownership</h2>
          <p className="text-blue-100">Own a share of luxury yachts and enjoy exclusive access</p>
        </div>
      </section>

      {/* Investment Stats */}
      <section className="px-4 py-6 bg-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">€32K</p>
            <p className="text-sm text-gray-600">Starting from</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">6-8</p>
            <p className="text-sm text-gray-600">Weeks usage</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">15%</p>
            <p className="text-sm text-gray-600">Avg. ROI</p>
          </div>
        </div>
      </section>

      {/* Opportunities List */}
      <section className="px-4 py-6">
        <div className="space-y-4">
          {mockOwnershipOpportunities.map((opportunity) => (
            <Link key={opportunity.id} href={`/ownership/${opportunity.id}`}>
              <Card className="card-hover cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={opportunity.yacht.images[0]} 
                      alt={opportunity.yacht.name}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-gray-900">{opportunity.shareFraction} Share</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold">{opportunity.availableShares} Available</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{opportunity.yacht.name}</h3>
                        <p className="text-gray-600">{opportunity.yacht.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">€{Number(opportunity.sharePrice).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">per share</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="font-semibold text-gray-900">{opportunity.usageWeeks} weeks</p>
                        <p className="text-xs text-gray-600">Annual usage</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="font-semibold text-gray-900">12-15%</p>
                        <p className="text-xs text-gray-600">Expected ROI</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{opportunity.yacht.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${opportunity.availableShares > 2 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className={`text-xs font-medium ${opportunity.availableShares > 2 ? 'text-green-600' : 'text-orange-600'}`}>
                          {opportunity.availableShares} shares left
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Share Marketplace CTA */}
      <section className="px-4 py-6">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500">
          <CardContent className="p-6 text-white text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Share Marketplace</h3>
            <p className="text-purple-100 mb-4">Buy and sell ownership shares with other investors</p>
            <Link href="/share-marketplace">
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Explore Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}
