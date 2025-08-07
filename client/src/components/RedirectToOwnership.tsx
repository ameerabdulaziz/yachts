import { useEffect } from "react";
import { useLocation } from "wouter";

export default function RedirectToOwnership() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect /hone to / (ownership home)
    setLocation("/");
  }, [setLocation]);

  return null;
}