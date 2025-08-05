import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { mockFuelTransactions } from "@/lib/mockData";

export default function FuelWalletScreen() {
  const balance = 1250;
  const monthlyChange = 200;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Fuel Wallet</h1>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <section className="px-4 py-6">
        <Card className="bg-gradient-ocean text-white shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-gas-pump text-3xl text-white"></i>
              </div>
              <h2 className="text-lg font-medium text-blue-100 mb-2">Current Balance</h2>
              <p className="text-4xl font-bold text-white">€{balance.toLocaleString()}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-green-300">+€{monthlyChange} this month</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/top-up">
                <Button className="w-full bg-white text-primary hover:bg-gray-100 font-semibold py-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Top Up
                </Button>
              </Link>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 font-semibold py-3">
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

      {/* Transaction History */}
      <section className="px-4 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {mockFuelTransactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'topup' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'topup' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'topup' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.type === 'topup' ? '+' : ''}€{Math.abs(Number(transaction.amount))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
