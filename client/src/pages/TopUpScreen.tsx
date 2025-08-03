import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Plus, Euro, Fuel, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TopUpScreen() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);

  const quickAmounts = [100, 250, 500, 1000, 2000, 5000];
  const currentBalance = 1250; // Mock current balance

  const topUpMutation = useMutation({
    mutationFn: async (data: { amount: number; paymentMethod: string }) => {
      const response = await apiRequest("POST", "/api/fuel-wallet/topup", {
        userId: "user-1", // In real app, get from auth context
        amount: data.amount.toString(),
        type: "topup",
        description: "Fuel wallet top-up"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Top-up Successful!",
        description: `€${amount} has been added to your fuel wallet.`,
      });
      setLocation("/fuel-wallet");
    },
    onError: () => {
      toast({
        title: "Top-up Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    setSelectedQuickAmount(quickAmount);
  };

  const handleCustomAmount = (value: string) => {
    setAmount(value);
    setSelectedQuickAmount(null);
  };

  const handleTopUp = () => {
    const topUpAmount = parseInt(amount);
    
    if (!amount || topUpAmount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum top-up amount is €10.",
        variant: "destructive",
      });
      return;
    }

    if (topUpAmount > 10000) {
      toast({
        title: "Amount Too Large",
        description: "Maximum top-up amount is €10,000.",
        variant: "destructive",
      });
      return;
    }

    topUpMutation.mutate({ amount: topUpAmount, paymentMethod });
  };

  const newBalance = amount ? currentBalance + parseInt(amount) : currentBalance;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link href="/fuel-wallet">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Top Up Fuel Wallet</h1>
        </div>
      </header>

      {/* Current Balance */}
      <section className="bg-gradient-ocean px-4 py-8 text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Fuel className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-medium text-blue-100 mb-2">Current Balance</h2>
          <p className="text-3xl font-bold text-white">€{currentBalance.toLocaleString()}</p>
          {amount && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-blue-100 text-sm">New balance after top-up</p>
              <p className="text-2xl font-bold text-white">€{newBalance.toLocaleString()}</p>
            </div>
          )}
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Quick Amounts */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Amounts</h3>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={selectedQuickAmount === quickAmount ? "default" : "outline"}
                  className={`h-16 flex flex-col items-center justify-center ${
                    selectedQuickAmount === quickAmount ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => handleQuickAmount(quickAmount)}
                >
                  <Euro className="w-5 h-5 mb-1" />
                  <span className="font-semibold">{quickAmount}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Amount */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Amount</h3>
            <div>
              <Label htmlFor="amount">Enter Amount (EUR)</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  placeholder="100"
                  className="pl-10 text-lg font-semibold"
                  min="10"
                  max="10000"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Minimum: €10</span>
                <span>Maximum: €10,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <Label htmlFor="credit-card" className="font-medium text-gray-900">Credit Card</Label>
                  <p className="text-sm text-gray-600">•••• •••• •••• 4532</p>
                  <p className="text-xs text-green-600">Verified</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                <RadioGroupItem value="bank-transfer" id="bank-transfer" disabled />
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <Label htmlFor="bank-transfer" className="font-medium text-gray-900">Bank Transfer</Label>
                  <p className="text-sm text-gray-600">3-5 business days</p>
                  <p className="text-xs text-gray-500">Coming soon</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                <RadioGroupItem value="paypal" id="paypal" disabled />
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <Label htmlFor="paypal" className="font-medium text-gray-900">PayPal</Label>
                  <p className="text-sm text-gray-600">Instant transfer</p>
                  <p className="text-xs text-gray-500">Coming soon</p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        {amount && (
          <Card>
            <CardContent className="p-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Top-up Amount</span>
                  <span className="font-medium">€{parseInt(amount).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Processing Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-primary">€{parseInt(amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card>
          <CardContent className="p-4 bg-green-50">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Fuel Wallet Benefits
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Instant booking confirmations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No transaction fees on bookings</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Automatic refunds for cancellations</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card>
          <CardContent className="p-4 bg-amber-50">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Important Information</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Funds are processed instantly with credit card</li>
                  <li>• Fuel wallet balance never expires</li>
                  <li>• Unused funds can be withdrawn anytime</li>
                  <li>• All transactions are secured and encrypted</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Up Button */}
        <Button 
          onClick={handleTopUp}
          disabled={!amount || topUpMutation.isPending}
          className="w-full bg-gradient-ocean text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
        >
          {topUpMutation.isPending ? (
            "Processing..."
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              {amount ? `Top Up €${parseInt(amount).toLocaleString()}` : "Enter Amount"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
