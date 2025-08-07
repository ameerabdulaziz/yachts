import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { enhancedScrollToTop } from '@/utils/scrollToTop';

export function useScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    enhancedScrollToTop();
  }, [location]);
}