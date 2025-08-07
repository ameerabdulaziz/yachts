import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ScrollHandler() {
  const [location] = useLocation();

  useEffect(() => {
    // Force immediate scroll to top
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also scroll any potential containers
      const containers = document.querySelectorAll('main, [role="main"], .overflow-auto, .overflow-y-auto');
      containers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.scrollTop = 0;
        }
      });
    };

    // Execute immediately
    scrollToTop();
    
    // Execute after microtask
    Promise.resolve().then(scrollToTop);
    
    // Execute after timeout
    setTimeout(scrollToTop, 0);
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
    
    // Execute on next frame
    requestAnimationFrame(scrollToTop);
  }, [location]);

  return null;
}