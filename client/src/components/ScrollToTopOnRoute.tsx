import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTopOnRoute() {
  const [location] = useLocation();

  useEffect(() => {
    const forceScrollTop = () => {
      // Primary: Scroll the phone frame content container
      const phoneContent = document.querySelector('.phone-content-scroll');
      if (phoneContent) {
        phoneContent.scrollTop = 0;
      }
      
      // Fallback: Standard window scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Execute immediately and with delays
    forceScrollTop();
    requestAnimationFrame(forceScrollTop);
    setTimeout(forceScrollTop, 0);
    setTimeout(forceScrollTop, 50);
  }, [location]);

  return null;
}