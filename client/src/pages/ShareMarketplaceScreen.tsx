import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown, Calendar, MapPin, Plus } from "lucide-react";

const mockShareListings = [
  {
    id: "listing-1",
    yacht: {
      name: "Azure Legend",
      location: "French Riviera",
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"
    },
    shareFraction: "1/8",
    sharesForSale: 1,
    originalPrice: 45000,
    askingPrice: 48000,
    priceChange: 6.7,
    usageWeeks: 6,
    seller: {
      name: "Sarah M.",
      rating: 4.9,
      verified: true
    },
    listedDate: new Date("2025-09-15"),
    reason: "Upgrading to larger share"
  },
  {
    id: "listing-2",
    yacht: {
      name: "Wind Dancer",
      location: "Greek Islands",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"
    },
    shareFraction: "1/6",
    sharesForSale: 1,
    originalPrice: 32000,
    askingPrice: 30000,
    priceChange: -6.3,
    usageWeeks: 8,
    seller: {
      name: "Michael R.",
      rating: 4.7,
      verified: true
    },
    listedDate: new Date("2025-09-20"),
    reason: "Relocating abroad"
  }
];

export default function ShareMarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/ownership-opportunities">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Share Marketplace</h1>
          </div>
          <Link href="/list-share-for-sale">
            <Button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">
              <Plus className="w-4 h-4 mr-1" />
              Sell
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-ocean px-4 py-8 text-white">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold mb-2">Trade Yacht Shares</h2>
          <p className="text-blue-100">Buy and sell ownership shares with other investors</p>
        </div>
      </section>

      {/* Market Stats */}
      <section className="px-4 py-6 bg-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{mockShareListings.length}</p>
            <p className="text-sm text-gray-600">Active Listings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">+12%</p>
            <p className="text-sm text-gray-600">Avg. Price Growth</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">€38K</p>
            <p className="text-sm text-gray-600">Avg. Share Price</p>
          </div>
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by yacht name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="price-change">Biggest price change</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All shares</SelectItem>
                    <SelectItem value="price-drop">Price drops</SelectItem>
                    <SelectItem value="new-listings">New listings</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Available Shares</h3>
            <Button variant="ghost" className="text-primary font-semibold">
              <Filter className="w-4 h-4 mr-1" />
              Refine
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockShareListings.map((listing) => (
              <Link key={listing.id} href={`/share-listing/${listing.id}`}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex">
                      <img 
                        src={listing.yacht.image} 
                        alt={listing.yacht.name}
                        className="w-24 h-24 object-cover rounded-l-2xl"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900">{listing.yacht.name}</h3>
                            <p className="text-sm text-gray-600">{listing.yacht.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {listing.shareFraction} share
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {listing.usageWeeks} weeks/year
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">€{listing.askingPrice.toLocaleString()}</p>
                            <div className={`flex items-center space-x-1 text-xs ${
                              listing.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {listing.priceChange > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              <span>{Math.abs(listing.priceChange)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-3">
                            <span>By {listing.seller.name}</span>
                            {listing.seller.verified && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{listing.listedDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Reason: {listing.reason}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Market Insights */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Mediterranean Shares</p>
                  <p className="text-sm text-green-700">Strong demand, 15% price increase</p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Caribbean Shares</p>
                  <p className="text-sm text-blue-700">Stable market, good liquidity</p>
                </div>
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selling CTA */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500">
          <CardContent className="p-6 text-white text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Have Shares to Sell?</h3>
            <p className="text-purple-100 mb-4">List your yacht shares and reach qualified buyers</p>
            <Link href="/list-share-for-sale">
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                List Your Shares
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
