import { useEffect } from "react";
import { useLocation } from "wouter";

export default function RedirectToOwnership() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Immediate redirect /hone to / (ownership home)
    console.log("Redirecting from /hone to /");
    window.history.replaceState({}, '', '/');
    setLocation("/");
  }, [setLocation]);

  // Show the ownership home screen content immediately while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}