import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Calendar, Fuel } from "lucide-react";
import { mockFuelTransactions } from "@/lib/mockData";

export default function FuelWalletScreen() {
  const balance = 1250;
  const monthlyChange = 200;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with Sea Background */}
      <header className="relative px-4 py-8 text-white overflow-hidden">
        {/* Turquoise Sea Background */}
        <div className="absolute inset-0 bg-gradient-ocean">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8
          }} />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 to-blue-500/40" />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Fuel Wallet</h1>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <section className="px-4 py-6 -mt-4">
        <Card className="bg-white text-gray-900 shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fuel className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-600 mb-2">Current Balance</h2>
              <p className="text-4xl font-bold text-gray-900">€{balance.toLocaleString()}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">+€{monthlyChange} this month</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/top-up">
                <Button className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up
                </Button>
              </Link>
              <Button variant="outline" className="w-full p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                <Calendar className="w-4 h-4 mr-2" />
                Auto-Pay
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-6 bg-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">€450</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600">Transactions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">€85</p>
            <p className="text-sm text-gray-600">Avg per trip</p>
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-4 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Fuel className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">22/07/2024</p>
                <p className="text-sm text-gray-600">Trip to Ibiza</p>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">€128</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Fuel className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">10/06/2024</p>
                <p className="text-sm text-gray-600">Trip to Saint-Tropez</p>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">€285</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Fuel className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">10/06/2024</p>
                <p className="text-sm text-gray-600">Trip to Mallorca</p>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">€644</span>
          </div>
        </div>
      </section>

      {/* Fuel Savings Tips */}
      <section className="px-4 py-6">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Fuel Savings Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Book longer trips for better fuel efficiency</li>
              <li>• Choose yachts with modern, fuel-efficient engines</li>
              <li>• Consider shorter coastal routes</li>
              <li>• Plan itineraries to minimize fuel consumption</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}
