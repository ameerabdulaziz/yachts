import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTopOnRoute() {
  const [location] = useLocation();

  useEffect(() => {
    // Aggressive scroll to top implementation
    const forceScrollTop = () => {
      // Method 1: Standard window scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      
      // Method 2: Direct element manipulation
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 3: Root element
      const root = document.getElementById('root');
      if (root) {
        root.scrollTop = 0;
      }
      
      // Method 4: All scrollable elements
      const scrollableElements = document.querySelectorAll('[style*="overflow"], [style*="scroll"]');
      scrollableElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.scrollTop = 0;
        }
      });
    };

    // Execute immediately
    forceScrollTop();
    
    // Execute on next frame
    requestAnimationFrame(forceScrollTop);
    
    // Execute with delays to handle async content loading
    setTimeout(forceScrollTop, 0);
    setTimeout(forceScrollTop, 10);
    setTimeout(forceScrollTop, 50);
    setTimeout(forceScrollTop, 100);
    setTimeout(forceScrollTop, 250);
    
    console.log('Forced scroll to top for route:', location);
  }, [location]);

  return null;
}