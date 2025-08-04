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
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/0fb4c8_60988eb5cf834fcb876c1d06bd8af594~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_1920,h_1080,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D50.jpg')`
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        {/* Top Section - Nauttec Logo */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-40 h-32 mx-auto mb-6 bg-white bg-opacity-95 rounded-3xl flex items-center justify-center shadow-2xl p-6">
              <img src={nauttecLogo} alt="Nauttec Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Nauttec</h1>
            <p className="text-white text-lg drop-shadow-md">Luxury Yacht Experiences</p>
            <div className="mt-8">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - De Antonio Yachts Logo */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-white text-sm mb-3 drop-shadow-md">Powered by</p>
            <div className="w-48 h-12 mx-auto bg-white bg-opacity-95 rounded-xl flex items-center justify-center shadow-lg p-3">
              <img 
                src="https://static.wixstatic.com/media/0fb4c8_1216819123734972b842c40dbd36e645~mv2.png/v1/fill/w_195,h_35,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/D50_BLANCO.png" 
                alt="De Antonio Yachts" 
                className="h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
