import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Anchor, TrendingUp, Users, PieChart, CreditCard, Shield, MapPin, Calendar, Check, ChevronRight, Calculator } from "lucide-react";
import { modalityDefinitions, yachtModalityConfigs, YachtModalityConfig } from "@/lib/mockData";
import seaBackground from "@assets/image_1754575606863.png";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";

const getModalityIcon = (type: string, size: string = "w-8 h-8") => {
  const className = size;
  switch (type) {
    case "OWN": return <Anchor className={className} />;
    case "EARN": return <TrendingUp className={className} />;
    case "CO_OWN": return <Users className={className} />;
    case "INVEST": return <PieChart className={className} />;
    default: return <Anchor className={className} />;
  }
};

const getModalityColor = (type: string) => {
  switch (type) {
    case "OWN": return { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" };
    case "EARN": return { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" };
    case "CO_OWN": return { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50" };
    case "INVEST": return { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50" };
    default: return { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" };
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};

export default function ModalityDetailScreen() {
  const [, params] = useRoute("/modality/:type");
  const [, setLocation] = useLocation();
  const modalityType = params?.type?.toUpperCase().replace("-", "_") || "OWN";
  
  const modality = modalityDefinitions.find(m => m.type === modalityType);
  const colors = getModalityColor(modalityType);
  
  const availableYachts = yachtModalityConfigs.filter(yacht => {
    const modalityKey = modalityType as keyof typeof yacht.modalities;
    return yacht.modalities[modalityKey]?.available;
  });

  const sortedYachts = modalityType === "INVEST" 
    ? [...availableYachts].sort((a, b) => {
        const yieldA = a.modalities.INVEST?.projectedYield || 0;
        const yieldB = b.modalities.INVEST?.projectedYield || 0;
        return yieldB - yieldA;
      })
    : availableYachts;

  if (!modality) {
    return <div>Modality not found</div>;
  }

  const renderYachtCard = (yacht: YachtModalityConfig) => {
    const modalityData = yacht.modalities[modalityType as keyof typeof yacht.modalities];
    
    return (
      <Card 
        key={yacht.yachtId}
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
        onClick={() => setLocation(`/ownership/${yacht.yachtId}`)}
        data-testid={`card-yacht-${yacht.yachtId}`}
      >
        <div className="relative h-40">
          <img 
            src={yacht.image} 
            alt={yacht.yachtName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${colors.bg} text-white`}>
              {modality.title}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{yacht.yachtName}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {yacht.location}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="mt-4 space-y-2">
            {modalityType === "OWN" && modalityData && "financing" in modalityData && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Purchase Price</span>
                  <span className="font-semibold">{formatCurrency(yacht.purchasePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">From</span>
                  <span className="font-semibold text-primary">{formatCurrency(modalityData.financing.monthlyFrom)}/mo</span>
                </div>
              </>
            )}

            {modalityType === "EARN" && yacht.modalities.EARN && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Projected Yield</span>
                  <span className="font-semibold text-green-600">{yacht.modalities.EARN.projectedYield.base}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Net Annual Cost</span>
                  <span className="font-semibold">{formatCurrency(yacht.modalities.EARN.netAnnualCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Personal Days</span>
                  <span className="font-semibold">{yacht.modalities.EARN.personalDaysIncluded} days/year</span>
                </div>
              </>
            )}

            {modalityType === "CO_OWN" && yacht.modalities.CO_OWN && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Starting From</span>
                  <span className="font-semibold">{formatCurrency(yacht.modalities.CO_OWN.shareOptions[yacht.modalities.CO_OWN.shareOptions.length - 1].price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Share Options</span>
                  <span className="font-semibold">{yacht.modalities.CO_OWN.shareOptions.map(s => s.fraction).join(", ")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usage Days</span>
                  <span className="font-semibold">{yacht.modalities.CO_OWN.shareOptions[yacht.modalities.CO_OWN.shareOptions.length - 1].usageDays}-{yacht.modalities.CO_OWN.shareOptions[0].usageDays} days</span>
                </div>
              </>
            )}

            {modalityType === "INVEST" && yacht.modalities.INVEST && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Projected Yield</span>
                  <span className="font-semibold text-amber-600">{yacht.modalities.INVEST.projectedYield}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min. Investment</span>
                  <span className="font-semibold">{formatCurrency(yacht.modalities.INVEST.minTicket)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Risk Rating</span>
                  <Badge variant="secondary" className={
                    yacht.modalities.INVEST.riskRating === "low" ? "bg-green-100 text-green-700" :
                    yacht.modalities.INVEST.riskRating === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }>
                    {yacht.modalities.INVEST.riskRating}
                  </Badge>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              <CreditCard className="w-3 h-3 mr-1" />
              Financing
            </Badge>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
              <Shield className="w-3 h-3 mr-1" />
              Insurance
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-ocean" style={{ height: '260px' }}>
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
            <div className="flex items-center space-x-3">
              <Link href="/access-models">
                <Button variant="ghost" size="sm" className="p-2 bg-white/80" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Button>
              </Link>
              <div className="w-[90px] h-[45px]">
                <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain object-left" />
              </div>
            </div>
          </div>
        </header>

        <section className="relative px-4 overflow-hidden pb-4">
          <div className="relative z-10">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center text-white shrink-0`}>
                    {getModalityIcon(modalityType, "w-8 h-8")}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{modality.title}</h1>
                    <p className={`${colors.text} font-medium`}>{modality.tagline}</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">{modality.description}</p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Financing Available
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Insurance Available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Tabs defaultValue="yachts" className="px-4">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="yachts" data-testid="tab-yachts">Yachts</TabsTrigger>
          <TabsTrigger value="benefits" data-testid="tab-benefits">Benefits</TabsTrigger>
          <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="yachts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Available Yachts ({sortedYachts.length})
            </h2>
            {modalityType === "INVEST" && (
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                Sorted by Yield
              </Badge>
            )}
          </div>
          
          <div className="space-y-4">
            {sortedYachts.map(yacht => renderYachtCard(yacht))}
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Key Benefits</h3>
              <div className="space-y-3">
                {modality.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-6 h-6 ${colors.light} ${colors.text} rounded-full flex items-center justify-center shrink-0`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Who is this for?</h3>
              <p className="text-gray-600">{modality.forWhom}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">How it Works</h3>
              
              {modalityType === "OWN" && (
                <div className="space-y-3 text-sm text-gray-600">
                  <p>1. Select your preferred De Antonio yacht from our available range</p>
                  <p>2. Choose between outright purchase or financing options</p>
                  <p>3. Add optional professional management services</p>
                  <p>4. Enjoy unlimited access to your yacht, year-round</p>
                </div>
              )}

              {modalityType === "EARN" && (
                <div className="space-y-3 text-sm text-gray-600">
                  <p>1. Purchase your yacht (full or shared ownership)</p>
                  <p>2. We manage charter operations when you're not using it</p>
                  <p>3. Receive quarterly income distributions (6-18% projected yield)</p>
                  <p>4. Enjoy priority personal usage throughout the year</p>
                </div>
              )}

              {modalityType === "CO_OWN" && (
                <div className="space-y-3 text-sm text-gray-600">
                  <p>1. Choose your share size (1/2, 1/4, 1/5, or 1/6)</p>
                  <p>2. Pay only your fraction of the purchase price</p>
                  <p>3. Book your guaranteed usage days via our scheduling system</p>
                  <p>4. Share all maintenance and operating costs proportionally</p>
                </div>
              )}

              {modalityType === "INVEST" && (
                <div className="space-y-3 text-sm text-gray-600">
                  <p>1. Choose investment amount (minimum tickets vary by yacht)</p>
                  <p>2. Yacht is fully managed for maximum charter revenue</p>
                  <p>3. Receive quarterly income distributions (8-15% projected yield)</p>
                  <p>4. Limited or no personal usage - pure investment focus</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900">Financing Calculator</h3>
              </div>
              <p className="text-sm text-gray-600">
                Get personalized financing estimates for any yacht in our fleet.
              </p>
              <Button variant="outline" className="w-full" data-testid="button-financing-calc">
                Open Financing Calculator
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
}
