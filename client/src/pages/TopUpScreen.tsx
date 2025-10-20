import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Plus, Euro, Fuel, CheckCircle, AlertCircle } from "lucide-react";
import saxdorLogo from "@assets/image_1760971559327.png";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import seaBackground from "@assets/image_1754575606863.png";
import BottomNavigation from "@/components/BottomNavigation";

export default function TopUpScreen() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);

  const quickAmounts = [500, 1000, 2000];
  const [currentBalance, setCurrentBalance] = useState(1250);
  
  // Load current balance from localStorage
  useEffect(() => {
    const savedBalance = localStorage.getItem('fuelWalletBalance');
    if (savedBalance) {
      setCurrentBalance(parseInt(savedBalance));
    }
  }, []);

  const topUpMutation = useMutation({
    mutationFn: async (data: { amount: number; paymentMethod: string }) => {
      // Simulate API call with delay for top-up
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, amount: data.amount };
    },
    onSuccess: (data) => {
      // Update the balance and save to localStorage
      const topUpAmount = parseInt(amount);
      const newBalance = currentBalance + topUpAmount;
      localStorage.setItem('fuelWalletBalance', newBalance.toString());
      
      // Add transaction to history
      const newTransaction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB'),
        description: 'Wallet Top-up',
        amount: topUpAmount,
        type: 'credit'
      };
      
      const existingTransactions = JSON.parse(localStorage.getItem('fuelTransactions') || '[]');
      existingTransactions.unshift(newTransaction); // Add to beginning
      localStorage.setItem('fuelTransactions', JSON.stringify(existingTransactions));
      
      toast({
        title: "Top up successful!",
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="relative bg-transparent px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-20 h-10 flex items-center justify-center">
              <img src={saxdorLogo} alt="Saxdor Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Current Balance */}
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
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fuel className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-600 mb-2">Current Balance</h2>
              <p className="text-3xl font-bold text-gray-900">€{currentBalance.toLocaleString()}</p>
            </div>
          </div>
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
                  <Label htmlFor="credit-card" className="font-medium text-gray-900">Debit/Credit Card</Label>
                  <p className="text-sm text-gray-600">•••• •••• •••• 4532</p>
                  <p className="text-xs text-green-600">Verified</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                <RadioGroupItem value="sepa" id="sepa" disabled />
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <Label htmlFor="sepa" className="font-medium text-gray-900">SEPA</Label>
                  <p className="text-sm text-gray-600">Instant</p>
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





        {/* Top Up Button */}
        <Button 
          onClick={handleTopUp}
          disabled={!amount || topUpMutation.isPending}
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:bg-blue-700"
        >
          {topUpMutation.isPending ? (
            "Processing..."
          ) : (
            amount ? `Top Up €${parseInt(amount).toLocaleString()}` : "Enter Amount"
          )}
        </Button>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
