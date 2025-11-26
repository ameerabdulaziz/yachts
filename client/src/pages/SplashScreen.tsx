import { useEffect } from "react";
import { useLocation } from "wouter";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.boatsgroup.com/images/1/51/79/de-antonio-yachts-d50-open-9275179-20240619063113-0.jpg" 
          alt="De Antonio Yacht" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Light Overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Top Section - Nauttec Logo positioned high up */}
        <div className="pt-16 px-8">
          <div className="text-center">
            <div className="w-72 h-[120px] mx-auto mb-8">
              <img src={deAntonioLogo} alt="De Antonio Logo" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <div className="mt-6">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Spacer to push De Antonio logo to bottom */}
        <div className="flex-1"></div>
        
        {/* Bottom Section - De Antonio Yachts branding */}
        <div className="text-center pb-8 px-8">
          <div className="flex items-center justify-center">
            <p className="text-white text-2xl font-bold tracking-wider drop-shadow-2xl" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
              DE ANTONIO YACHTS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
