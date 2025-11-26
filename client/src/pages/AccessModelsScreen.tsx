import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { Anchor, TrendingUp, Users, PieChart, ArrowRight, CreditCard, Shield, ChevronRight } from "lucide-react";
import { modalityDefinitions } from "@/lib/mockData";
import seaBackground from "@assets/image_1754575606863.png";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";

const getModalityIcon = (iconName: string) => {
  switch (iconName) {
    case "Anchor": return <Anchor className="w-8 h-8" />;
    case "TrendingUp": return <TrendingUp className="w-8 h-8" />;
    case "Users": return <Users className="w-8 h-8" />;
    case "PieChart": return <PieChart className="w-8 h-8" />;
    default: return <Anchor className="w-8 h-8" />;
  }
};

const getModalityColor = (type: string) => {
  switch (type) {
    case "OWN": return "from-blue-500 to-blue-600";
    case "EARN": return "from-green-500 to-green-600";
    case "CO_OWN": return "from-purple-500 to-purple-600";
    case "INVEST": return "from-amber-500 to-amber-600";
    default: return "from-blue-500 to-blue-600";
  }
};

const getModalityRoute = (type: string) => {
  switch (type) {
    case "OWN": return "/modality/own";
    case "EARN": return "/modality/earn";
    case "CO_OWN": return "/modality/co-own";
    case "INVEST": return "/modality/invest";
    default: return "/modality/own";
  }
};

export default function AccessModelsScreen() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-ocean" style={{ height: '280px' }}>
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
              <h1 className="text-2xl font-bold mb-2 text-gray-900">Access Models</h1>
              <p className="text-gray-600">Choose how you want to experience De Antonio yachting</p>
            </div>
          </div>
        </section>
      </div>

      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Four Ways to Own</h2>
          <Link href="/onboarding">
            <Button variant="outline" size="sm" className="text-primary border-primary" data-testid="button-take-quiz">
              Take Quiz
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {modalityDefinitions.map((modality) => (
            <Card 
              key={modality.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-0 shadow-md"
              onClick={() => setLocation(getModalityRoute(modality.type))}
              data-testid={`card-modality-${modality.type.toLowerCase()}`}
            >
              <CardContent className="p-0">
                <div className="flex">
                  <div className={`w-24 bg-gradient-to-br ${getModalityColor(modality.type)} flex items-center justify-center text-white`}>
                    {getModalityIcon(modality.icon)}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{modality.title}</h3>
                        <p className="text-primary text-sm font-medium">{modality.tagline}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{modality.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {modality.financingAvailable && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                          <CreditCard className="w-3 h-3 mr-1" />
                          Financing
                        </Badge>
                      )}
                      {modality.insuranceAvailable && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                          <Shield className="w-3 h-3 mr-1" />
                          Insurance
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-6">
        <Card className="bg-gradient-to-br from-primary to-blue-600 text-white border-0">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-xl font-bold">Not sure which is right for you?</h3>
            <p className="text-blue-100">Take our quick assessment to find your perfect match</p>
            <Link href="/onboarding">
              <Button 
                className="bg-white text-primary hover:bg-gray-100 px-6"
                data-testid="button-start-quiz"
              >
                Start Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compare Models</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium text-gray-700 sticky left-0 bg-gray-50">Feature</th>
                    <th className="px-3 py-3 text-center font-medium text-blue-600">OWN</th>
                    <th className="px-3 py-3 text-center font-medium text-green-600">EARN</th>
                    <th className="px-3 py-3 text-center font-medium text-purple-600">CO-OWN</th>
                    <th className="px-3 py-3 text-center font-medium text-amber-600">INVEST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-700 sticky left-0 bg-white">Personal Use</td>
                    <td className="px-3 py-3 text-center text-green-600">365 days</td>
                    <td className="px-3 py-3 text-center text-green-600">60-120</td>
                    <td className="px-3 py-3 text-center text-green-600">60-182</td>
                    <td className="px-3 py-3 text-center text-gray-400">0-21</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-3 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50/50">Income</td>
                    <td className="px-3 py-3 text-center text-gray-400">Optional</td>
                    <td className="px-3 py-3 text-center text-green-600">6-18%</td>
                    <td className="px-3 py-3 text-center text-gray-400">None</td>
                    <td className="px-3 py-3 text-center text-green-600">8-15%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium text-gray-700 sticky left-0 bg-white">Entry Price</td>
                    <td className="px-3 py-3 text-center">€214k+</td>
                    <td className="px-3 py-3 text-center">€214k+</td>
                    <td className="px-3 py-3 text-center">€43k+</td>
                    <td className="px-3 py-3 text-center">€50k+</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-3 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50/50">Management</td>
                    <td className="px-3 py-3 text-center">Optional</td>
                    <td className="px-3 py-3 text-center">Included</td>
                    <td className="px-3 py-3 text-center">Included</td>
                    <td className="px-3 py-3 text-center">Full</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}
