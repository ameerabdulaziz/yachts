import { useEffect } from "react";
import { useLocation } from "wouter";
import nauttecLogo from "@assets/Nauttec Logo_1754330395988.png";
import yachtBackground from "@assets/de antonio D50 (1)_1754331061302.jpg";
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
          src={yachtBackground} 
          alt="De Antonio Yacht" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Light Overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        {/* Top Section - Nauttec Logo Only */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-40 h-32 mx-auto mb-8">
              <img src={nauttecLogo} alt="Nauttec Logo" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <div className="mt-8">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - De Antonio Yachts Logo */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-white text-sm mb-3 drop-shadow-lg">Powered by</p>
            <div className="w-56 h-16 mx-auto flex items-center justify-center">
              <img 
                src={deAntonioLogo} 
                alt="De Antonio Yachts" 
                className="h-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
