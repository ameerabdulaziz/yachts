import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  PieChart, TrendingUp, Shield, Wallet, ChevronRight, 
  BarChart3, Target, Clock, ArrowUpRight, Info, Calculator,
  Sparkles, Building2, Ship
} from "lucide-react";
import { yachtModalityConfigs } from "@/lib/mockData";
import seaBackground from "@assets/image_1754575606863.png";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";

type InvestmentTier = "starter" | "growth" | "premium";

interface InvestmentOption {
  id: string;
  tier: InvestmentTier;
  name: string;
  minInvestment: number;
  maxInvestment: number;
  projectedYield: { min: number; max: number };
  riskLevel: "low" | "medium" | "high";
  term: string;
  features: string[];
  description: string;
  color: string;
  icon: typeof PieChart;
}

const investmentOptions: InvestmentOption[] = [
  {
    id: "starter",
    tier: "starter",
    name: "Starter Portfolio",
    minInvestment: 25000,
    maxInvestment: 100000,
    projectedYield: { min: 6, max: 8 },
    riskLevel: "low",
    term: "12-24 months",
    features: [
      "Diversified yacht fleet exposure",
      "Quarterly dividend payments",
      "Low minimum entry",
      "Flexible exit options"
    ],
    description: "Ideal for first-time yacht investors seeking stable returns with minimal risk exposure.",
    color: "from-emerald-500 to-emerald-600",
    icon: Sparkles
  },
  {
    id: "growth",
    tier: "growth",
    name: "Growth Portfolio",
    minInvestment: 100000,
    maxInvestment: 500000,
    projectedYield: { min: 10, max: 14 },
    riskLevel: "medium",
    term: "24-36 months",
    features: [
      "Premium yacht selection",
      "Monthly income distribution",
      "Priority co-ownership upgrades",
      "Charter revenue sharing",
      "Annual yacht appreciation"
    ],
    description: "Balanced growth strategy combining charter income with asset appreciation potential.",
    color: "from-blue-500 to-blue-600",
    icon: TrendingUp
  },
  {
    id: "premium",
    tier: "premium",
    name: "Premium Portfolio",
    minInvestment: 500000,
    maxInvestment: 2000000,
    projectedYield: { min: 12, max: 18 },
    riskLevel: "medium",
    term: "36-60 months",
    features: [
      "Flagship yacht investments (D50, D60)",
      "Weekly income potential",
      "Personal usage days included",
      "White-glove management",
      "Priority resale market access",
      "Tax optimization strategies"
    ],
    description: "Exclusive access to flagship yachts with maximum yield potential and personal usage benefits.",
    color: "from-amber-500 to-amber-600",
    icon: Building2
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};

type SortOption = "yield" | "ticket";

export default function InvestScreen() {
  const [, setLocation] = useLocation();
  const [selectedTier, setSelectedTier] = useState<InvestmentTier | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<SortOption>("yield");

  const investYachts = yachtModalityConfigs
    .filter(y => y.modalities.INVEST?.available)
    .sort((a, b) => {
      if (sortBy === "yield") {
        return (b.modalities.INVEST?.projectedYield || 0) - (a.modalities.INVEST?.projectedYield || 0);
      } else {
        return (a.modalities.INVEST?.minTicket || 0) - (b.modalities.INVEST?.minTicket || 0);
      }
    });
  
  const totalPortfolioValue = investYachts.reduce((sum, y) => sum + y.purchasePrice, 0);
  const avgYield = investYachts.length > 0 
    ? investYachts.reduce((sum, y) => sum + (y.modalities.INVEST?.projectedYield || 0), 0) / investYachts.length
    : 0;

  const handleSelectTier = (tier: InvestmentTier) => {
    setSelectedTier(tier);
    const option = investmentOptions.find(o => o.tier === tier);
    if (option) {
      setInvestmentAmount(option.minInvestment);
    }
  };

  const calculateProjectedReturns = (amount: number, yieldRange: { min: number; max: number }) => {
    const minReturn = amount * (yieldRange.min / 100);
    const maxReturn = amount * (yieldRange.max / 100);
    return { min: minReturn, max: maxReturn };
  };

  const renderInvestmentFlow = () => {
    const option = investmentOptions.find(o => o.tier === selectedTier);
    if (!option) return null;

    const returns = calculateProjectedReturns(investmentAmount, option.projectedYield);

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTier(null)}
            className="text-gray-600"
            data-testid="button-back-to-options"
          >
            ← Back to options
          </Button>
          <Badge className={`bg-gradient-to-r ${option.color} text-white`}>
            {option.name}
          </Badge>
        </div>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className={`bg-gradient-to-r ${option.color} p-6 text-white`}>
            <div className="flex items-center gap-3 mb-4">
              <option.icon className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">{option.name}</h2>
                <p className="text-white/80 text-sm">{option.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-white/70 text-xs">Projected Yield</p>
                <p className="font-bold text-lg">{option.projectedYield.min}-{option.projectedYield.max}%</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Term</p>
                <p className="font-bold text-lg">{option.term}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Risk Level</p>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 capitalize">
                  {option.riskLevel}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Investment Amount
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={option.minInvestment}
                  max={option.maxInvestment}
                  step={10000}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  data-testid="slider-investment-amount"
                />
                <div className="text-right min-w-[120px]">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(investmentAmount)}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatCurrency(option.minInvestment)}</span>
                <span>{formatCurrency(option.maxInvestment)}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Projected Annual Returns
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500">Conservative</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(returns.min)}/yr
                  </p>
                  <p className="text-xs text-gray-400">{formatCurrency(returns.min / 12)}/mo</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500">Optimistic</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(returns.max)}/yr
                  </p>
                  <p className="text-xs text-gray-400">{formatCurrency(returns.max / 12)}/mo</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
              <div className="space-y-2">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight className="w-3 h-3 text-green-600" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90`}
                size="lg"
                onClick={() => setLocation(`/invest/apply/${option.tier}`)}
                data-testid="button-start-investment"
              >
                Start Investment Application
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation("/invest/schedule-call")}
                data-testid="button-schedule-call"
              >
                Schedule a Call with Advisor
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Investment Disclaimer</p>
                <p>Past performance does not guarantee future results. All investments carry risk. Projected yields are estimates based on historical charter revenue and market appreciation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-ocean" style={{ height: '310px' }}>
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${seaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-blue-200/20 to-blue-500/30" />
        </div>

        <header className="relative bg-transparent px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-[90px] h-[45px] flex items-start justify-start">
                <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain object-left" />
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

        <section className="relative px-4 overflow-hidden" style={{ paddingTop: '0px', paddingBottom: '16px' }}>
          <div className="relative z-10">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PieChart className="w-6 h-6 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-gray-900">Yacht Investment</h1>
              <p className="text-gray-600">Build wealth through luxury yacht assets</p>
            </div>
          </div>
        </section>
      </div>

      <div className="px-4">
        {selectedTier ? (
          renderInvestmentFlow()
        ) : (
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="options" data-testid="tab-options">Investment Options</TabsTrigger>
              <TabsTrigger value="portfolio" data-testid="tab-portfolio">Available Yachts</TabsTrigger>
            </TabsList>

            <TabsContent value="options" className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-6">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100">
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-emerald-700 mb-1">Fleet Value</p>
                    <p className="font-bold text-emerald-900">{formatCurrency(totalPortfolioValue)}</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-blue-700 mb-1">Avg. Yield</p>
                    <p className="font-bold text-blue-900">{avgYield.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-amber-700 mb-1">Yachts</p>
                    <p className="font-bold text-amber-900">{investYachts.length}</p>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-3">Choose Your Investment Tier</h2>

              {investmentOptions.map((option) => (
                <Card 
                  key={option.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-0 shadow-md"
                  onClick={() => handleSelectTier(option.tier)}
                  data-testid={`card-invest-${option.tier}`}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className={`w-24 bg-gradient-to-br ${option.color} flex items-center justify-center text-white`}>
                        <option.icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{option.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {option.projectedYield.min}-{option.projectedYield.max}% yield
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Wallet className="w-3 h-3 mr-1" />
                            From {formatCurrency(option.minInvestment)}
                          </Badge>
                          <Badge variant="secondary" className={`text-xs capitalize ${
                            option.riskLevel === "low" ? "bg-green-100 text-green-700" :
                            option.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {option.riskLevel} risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-0 shadow-md bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">Not sure which tier?</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        Take our quick assessment to find the perfect investment strategy for your goals.
                      </p>
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => setLocation("/onboarding")}
                        data-testid="button-investment-quiz"
                      >
                        Take Investment Quiz
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Available for Investment</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Sort:</span>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setSortBy("yield")}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        sortBy === "yield" 
                          ? "bg-green-600 text-white" 
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                      data-testid="button-sort-yield"
                    >
                      Highest Yield
                    </button>
                    <button
                      onClick={() => setSortBy("ticket")}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        sortBy === "ticket" 
                          ? "bg-green-600 text-white" 
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                      data-testid="button-sort-ticket"
                    >
                      Min. Ticket
                    </button>
                  </div>
                </div>
              </div>
              
              {investYachts.map((yacht) => (
                <Card 
                  key={yacht.yachtId}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setLocation(`/ownership/${yacht.yachtId}`)}
                  data-testid={`card-invest-yacht-${yacht.yachtId}`}
                >
                  <div className="relative h-40">
                    <img 
                      src={yacht.image} 
                      alt={yacht.yachtName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-600 text-white">
                        {yacht.modalities.INVEST?.projectedYield}% Yield
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h3 className="font-bold text-white">{yacht.yachtName}</h3>
                      <p className="text-white/80 text-sm">{yacht.location}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Min. Investment</p>
                        <p className="font-semibold text-sm">{formatCurrency(yacht.modalities.INVEST?.minTicket || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Purchase Price</p>
                        <p className="font-semibold text-sm">{formatCurrency(yacht.purchasePrice)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Ship className="w-4 h-4" />
                        <span>{yacht.location}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
