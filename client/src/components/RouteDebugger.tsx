import { useEffect } from "react";
import { useLocation } from "wouter";

export default function RouteDebugger() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Log all route changes for debugging
    console.log('=== ROUTE DEBUG ===');
    console.log('Current route:', location);
    console.log('Full URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    console.log('Search:', window.location.search);
    console.log('Hash:', window.location.hash);
    console.log('User Agent:', navigator.userAgent);
    console.log('===================');
    
    // If we detect /hone, immediately redirect
    if (window.location.pathname === '/hone' || location === '/hone') {
      console.log('DETECTED /hone - REDIRECTING TO /');
      window.history.replaceState({}, '', '/');
      window.location.href = '/';
    }
  }, [location]);
  
  // Show debug info in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed top-0 right-0 bg-red-500 text-white p-2 text-xs z-50 max-w-xs">
        Route: {location} | URL: {window.location.pathname}
      </div>
    );
  }
  
  return null;
}