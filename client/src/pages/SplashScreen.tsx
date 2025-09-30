import { useEffect } from "react";
import { useLocation } from "wouter";
import nauttecLogo from "@assets/Nauttec Logo_1754330395988.png";
import saxdorLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";

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
          src="https://saxdoryachts.com/wp-content/uploads/2023/12/DJI_0009-Enhanced-NR-2.jpg" 
          alt="Saxdor Yacht" 
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
            <div className="w-48 h-20 mx-auto mb-8">
              <img src={nauttecLogo} alt="Nauttec Logo" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <div className="mt-6">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Spacer to push Saxdor logo to bottom */}
        <div className="flex-1"></div>
        
        {/* Bottom Section - Saxdor Yachts Logo positioned at very bottom */}
        <div className="text-center pb-8 px-8">
          <div className="w-64 h-14 mx-auto flex items-center justify-center">
            <img 
              src={saxdorLogo} 
              alt="Saxdor Yachts" 
              className="h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
