// Utility function to force scroll to top
export function forceScrollToTop() {
  // Multiple methods to ensure scroll works
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // Handle any scrollable containers
  const scrollableElements = document.querySelectorAll('[data-scroll-container], main, .overflow-auto, .overflow-y-auto');
  scrollableElements.forEach(element => {
    if (element instanceof HTMLElement) {
      element.scrollTop = 0;
    }
  });
}

// Enhanced scroll to top with multiple attempts
export function enhancedScrollToTop() {
  forceScrollToTop();
  
  // Try again after DOM updates
  setTimeout(forceScrollToTop, 0);
  setTimeout(forceScrollToTop, 10);
  setTimeout(forceScrollToTop, 50);
  
  // Final attempt after all animations
  requestAnimationFrame(() => {
    forceScrollToTop();
  });
}