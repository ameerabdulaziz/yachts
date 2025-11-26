import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Anchor, TrendingUp, Users, PieChart, MapPin, Calendar, Wallet, CheckCircle2 } from "lucide-react";
import { getRecommendedModality, modalityDefinitions } from "@/lib/mockData";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";

type OnboardingStep = "welcome" | "goals" | "budget" | "usage" | "geography" | "result";

export default function OnboardingScreen() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [answers, setAnswers] = useState({
    goals: [] as string[],
    budgetMin: 50000,
    budgetMax: 300000,
    monthlyPaymentComfort: 2000,
    openToFinancing: true,
    usageVsYield: "lifestyle" as string,
    geoPreference: "near_me" as string,
    expectedUsageDays: 60,
  });
  const [recommendation, setRecommendation] = useState<ReturnType<typeof getRecommendedModality> | null>(null);

  const steps: OnboardingStep[] = ["welcome", "goals", "budget", "usage", "geography", "result"];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100;

  const toggleGoal = (goal: string) => {
    setAnswers(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      if (steps[nextIndex] === "result") {
        const result = getRecommendedModality(answers);
        setRecommendation(result);
      }
      setStep(steps[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("userOnboardingCompleted", "true");
    localStorage.setItem("userSegment", JSON.stringify({
      primary: recommendation?.primary,
      answers
    }));
    setLocation("/access-models");
  };

  const getModalityIcon = (type: string) => {
    switch (type) {
      case "OWN": return <Anchor className="w-8 h-8" />;
      case "EARN": return <TrendingUp className="w-8 h-8" />;
      case "CO_OWN": return <Users className="w-8 h-8" />;
      case "INVEST": return <PieChart className="w-8 h-8" />;
      default: return <Anchor className="w-8 h-8" />;
    }
  };

  const getModalityInfo = (type: string) => {
    return modalityDefinitions.find(m => m.type === type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {step !== "welcome" && step !== "result" && (
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3 z-10">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={prevStep} className="p-2" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-[90px] h-[45px]">
              <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain" />
            </div>
            <div className="w-9" />
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}

      <div className="p-4 pb-8">
        {step === "welcome" && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-[180px] h-[90px]">
              <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">How do you want to access yachting?</h1>
              <p className="text-gray-600 max-w-md">
                Answer a few quick questions and we'll recommend the best ownership model for your needs.
              </p>
            </div>
            <Button 
              onClick={nextStep}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl"
              data-testid="button-start-assessment"
            >
              Start Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {step === "goals" && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">What are you looking for?</h2>
              <p className="text-gray-600">Select all that apply</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "own_boat", label: "I want my own boat", icon: <Anchor className="w-5 h-5" />, desc: "Full ownership and control" },
                { id: "reduce_costs", label: "I want to reduce my annual costs", icon: <Wallet className="w-5 h-5" />, desc: "Generate income to offset expenses" },
                { id: "share_ownership", label: "I want to share ownership", icon: <Users className="w-5 h-5" />, desc: "Split costs with other owners" },
                { id: "financial_investment", label: "I want a financial investment", icon: <TrendingUp className="w-5 h-5" />, desc: "Pure yield-focused investment" },
              ].map((goal) => (
                <Card 
                  key={goal.id}
                  className={`cursor-pointer transition-all ${
                    answers.goals.includes(goal.id) 
                      ? "border-primary bg-primary/5 ring-2 ring-primary" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleGoal(goal.id)}
                  data-testid={`card-goal-${goal.id}`}
                >
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${answers.goals.includes(goal.id) ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{goal.label}</h3>
                      <p className="text-sm text-gray-500">{goal.desc}</p>
                    </div>
                    {answers.goals.includes(goal.id) && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={nextStep}
              disabled={answers.goals.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl"
              data-testid="button-continue-goals"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {step === "budget" && (
          <div className="max-w-lg mx-auto space-y-8 pt-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Budget & Financing</h2>
              <p className="text-gray-600">Help us understand your investment comfort</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Investment Range (CAPEX)</span>
                  <span className="text-sm font-semibold text-primary">
                    €{answers.budgetMin.toLocaleString()} - €{answers.budgetMax.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[answers.budgetMin, answers.budgetMax]}
                  onValueChange={([min, max]) => setAnswers(prev => ({ ...prev, budgetMin: min, budgetMax: max }))}
                  min={25000}
                  max={1500000}
                  step={25000}
                  className="w-full"
                  data-testid="slider-budget"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>€25k</span>
                  <span>€1.5M</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Monthly Payment Comfort</span>
                  <span className="text-sm font-semibold text-primary">
                    €{answers.monthlyPaymentComfort.toLocaleString()}/mo
                  </span>
                </div>
                <Slider
                  value={[answers.monthlyPaymentComfort]}
                  onValueChange={([value]) => setAnswers(prev => ({ ...prev, monthlyPaymentComfort: value }))}
                  min={500}
                  max={15000}
                  step={250}
                  className="w-full"
                  data-testid="slider-monthly"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>€500</span>
                  <span>€15k</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-medium text-gray-900">Open to Financing?</h3>
                  <p className="text-sm text-gray-500">Finance your yacht purchase</p>
                </div>
                <Switch
                  checked={answers.openToFinancing}
                  onCheckedChange={(checked) => setAnswers(prev => ({ ...prev, openToFinancing: checked }))}
                  data-testid="switch-financing"
                />
              </div>
            </div>

            <Button 
              onClick={nextStep}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl"
              data-testid="button-continue-budget"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {step === "usage" && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">What matters most?</h2>
              <p className="text-gray-600">Balance between lifestyle and returns</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "lifestyle", label: "Enjoyment & lifestyle", desc: "I want to use my yacht regularly", icon: <Anchor className="w-5 h-5" /> },
                { id: "lifestyle_plus_income", label: "Enjoyment + some income", desc: "Use it and earn when I don't", icon: <TrendingUp className="w-5 h-5" /> },
                { id: "mostly_income", label: "Mostly income / yield", desc: "Prioritize returns over usage", icon: <PieChart className="w-5 h-5" /> },
                { id: "pure_investment", label: "Pure investment", desc: "I may never use the boat", icon: <Wallet className="w-5 h-5" /> },
              ].map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all ${
                    answers.usageVsYield === option.id 
                      ? "border-primary bg-primary/5 ring-2 ring-primary" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setAnswers(prev => ({ ...prev, usageVsYield: option.id }))}
                  data-testid={`card-usage-${option.id}`}
                >
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${answers.usageVsYield === option.id ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                    {answers.usageVsYield === option.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Expected usage days per year</span>
                <span className="text-sm font-semibold text-primary">{answers.expectedUsageDays} days</span>
              </div>
              <Slider
                value={[answers.expectedUsageDays]}
                onValueChange={([value]) => setAnswers(prev => ({ ...prev, expectedUsageDays: value }))}
                min={0}
                max={180}
                step={5}
                className="w-full"
                data-testid="slider-usage-days"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0 days</span>
                <span>180 days</span>
              </div>
            </div>

            <Button 
              onClick={nextStep}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl"
              data-testid="button-continue-usage"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {step === "geography" && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Where should your boat be?</h2>
              <p className="text-gray-600">Location preferences for your yacht</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "near_me", label: "Near me / same country", desc: "Easy access for regular use", icon: <MapPin className="w-5 h-5" /> },
                { id: "region", label: "Within region / short travel", desc: "Mediterranean, Caribbean, etc.", icon: <MapPin className="w-5 h-5" /> },
                { id: "anywhere", label: "Anywhere if yield is better", desc: "Pure investment focus", icon: <TrendingUp className="w-5 h-5" /> },
              ].map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all ${
                    answers.geoPreference === option.id 
                      ? "border-primary bg-primary/5 ring-2 ring-primary" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setAnswers(prev => ({ ...prev, geoPreference: option.id }))}
                  data-testid={`card-geo-${option.id}`}
                >
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${answers.geoPreference === option.id ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                    {answers.geoPreference === option.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={nextStep}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl"
              data-testid="button-see-results"
            >
              See My Results
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {step === "result" && recommendation && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="text-center space-y-2">
              <div className="w-[120px] h-[60px] mx-auto mb-4">
                <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Perfect Match</h2>
              <p className="text-gray-600">Based on your preferences, we recommend:</p>
            </div>

            <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center text-white">
                  {getModalityIcon(recommendation.primary)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {getModalityInfo(recommendation.primary)?.title}
                  </h3>
                  <p className="text-primary font-medium">
                    {recommendation.confidence}% match
                  </p>
                </div>
                <p className="text-gray-600">
                  {getModalityInfo(recommendation.primary)?.tagline}
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Financing Available</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Insurance Available</span>
                </div>
              </CardContent>
            </Card>

            {recommendation.alternatives.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 text-center">Also consider:</h4>
                <div className="flex gap-3">
                  {recommendation.alternatives.slice(0, 2).map((alt) => (
                    <Card key={alt.modality} className="flex-1 border-gray-200">
                      <CardContent className="p-4 text-center space-y-2">
                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                          {getModalityIcon(alt.modality)}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">
                            {getModalityInfo(alt.modality)?.title}
                          </h5>
                          <p className="text-xs text-gray-500">{alt.score}% match</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleComplete}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl text-lg"
              data-testid="button-continue-modality"
            >
              Continue with {getModalityInfo(recommendation.primary)?.title}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <button 
              onClick={() => setLocation("/access-models")}
              className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
              data-testid="button-explore-all"
            >
              Explore all access models
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
