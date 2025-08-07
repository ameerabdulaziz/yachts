import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Use multiple methods to ensure reliable scroll to top
    const scrollToTop = () => {
      // Method 1: Standard scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      
      // Method 2: Fallback for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 3: Ensure main container is also at top
      const mainContainer = document.querySelector('main') || document.querySelector('[data-main]');
      if (mainContainer) {
        mainContainer.scrollTop = 0;
      }
    };

    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      scrollToTop();
      // Double-check after a small delay to handle any async rendering
      setTimeout(scrollToTop, 10);
    });
  }, [location]);
}