import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown, Calendar, MapPin, Plus } from "lucide-react";
import seaBackground from "@assets/image_1754575606863.png";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";

// De Antonio Yachts share listings - D29, D33, D36, D42, D50, D60 range
const mockShareListings = [
  {
    id: "listing-1",
    yacht: {
      name: "De Antonio D50",
      location: "El Gouna, Egypt",
      image: "https://static.wixstatic.com/media/0fb4c8_60988eb5cf834fcb876c1d06bd8af594~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D50.jpg"
    },
    shareFraction: "1/5",
    sharesForSale: 1,
    originalPrice: 134100,
    askingPrice: 142000,
    priceChange: 5.9,
    usageWeeks: 10,
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
      name: "De Antonio D36",
      location: "El Gouna, Egypt",
      image: "https://static.wixstatic.com/media/0fb4c8_fbbb6a2569c747d48881f7ac065b947a~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D36.jpg"
    },
    shareFraction: "1/5",
    sharesForSale: 1,
    originalPrice: 85200,
    askingPrice: 79800,
    priceChange: -6.3,
    usageWeeks: 10,
    seller: {
      name: "Michael R.",
      rating: 4.7,
      verified: true
    },
    listedDate: new Date("2025-09-20"),
    reason: "Relocating abroad"
  },
  {
    id: "listing-3",
    yacht: {
      name: "De Antonio D60",
      location: "El Gouna, Egypt",
      image: "https://static.wixstatic.com/media/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg"
    },
    shareFraction: "1/5",
    sharesForSale: 1,
    originalPrice: 253950,
    askingPrice: 267400,
    priceChange: 5.3,
    usageWeeks: 10,
    seller: {
      name: "James K.",
      rating: 4.8,
      verified: true
    },
    listedDate: new Date("2025-09-18"),
    reason: "Portfolio rebalancing"
  },
  {
    id: "listing-4",
    yacht: {
      name: "De Antonio D42",
      location: "El Gouna, Egypt",
      image: "https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg"
    },
    shareFraction: "1/5",
    sharesForSale: 1,
    originalPrice: 102600,
    askingPrice: 108500,
    priceChange: 5.7,
    usageWeeks: 10,
    seller: {
      name: "Anna P.",
      rating: 5.0,
      verified: true
    },
    listedDate: new Date("2025-09-22"),
    reason: "Business expansion"
  }
];

export default function ShareMarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [userListings, setUserListings] = useState([]);
  
  // Load user's listed shares from localStorage
  useEffect(() => {
    const storedListings = JSON.parse(localStorage.getItem('userShareListings') || '[]');
    // Convert listedDate strings back to Date objects
    const listingsWithDates = storedListings.map((listing: any) => ({
      ...listing,
      listedDate: new Date(listing.listedDate)
    }));
    setUserListings(listingsWithDates);
  }, []);
  
  // Combine mock listings with user listings
  const allListings = [...userListings, ...mockShareListings];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/ownership-opportunities">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <div className="w-[57px] h-[28px] bg-white rounded-lg flex items-center justify-start p-1">
              <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain object-left" />
            </div>
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
      <section className="relative px-4 py-8 overflow-hidden">
        {/* Turquoise Sea Background */}
        <div className="absolute inset-0 bg-gradient-ocean">
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${seaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-blue-200/20 to-blue-500/30" />
        </div>
        
        <div className="relative z-10">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">De Antonio Share Marketplace</h2>
            <p className="text-gray-600">Buy and sell ownership shares with other yacht investors</p>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="px-4 py-6 bg-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{allListings.length}</p>
            <p className="text-sm text-gray-600">Active Listings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">+12%</p>
            <p className="text-sm text-gray-600">Avg. Price Growth</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">€120K</p>
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
            {allListings.map((listing) => (
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
                              {(listing as any).isUserListing && (
                                <Badge className="bg-blue-600 text-white text-xs">
                                  Your Listing
                                </Badge>
                              )}
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
                  <p className="text-sm text-green-700">Strong demand, 8% price increase</p>
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
