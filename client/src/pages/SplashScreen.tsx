import { useEffect } from "react";
import { useLocation } from "wouter";
import nauttecLogo from "@assets/Nauttec Logo_1754330395988.png";

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="fixed inset-0 bg-gradient-ocean flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center">
        <div className="w-32 h-24 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-4">
          <img src={nauttecLogo} alt="Nauttec Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Nauttec</h1>
        <p className="text-blue-100 text-lg">Luxury Yacht Experiences</p>
        <div className="mt-8">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
