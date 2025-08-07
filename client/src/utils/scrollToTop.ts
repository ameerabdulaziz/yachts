export function enhancedScrollToTop() {
  // Force immediate scroll to top using multiple methods
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // Also scroll the root element and any containers
  const root = document.getElementById('root');
  if (root) root.scrollTop = 0;
  
  const mainContainer = document.querySelector('main') || document.querySelector('.min-h-screen');
  if (mainContainer && mainContainer instanceof HTMLElement) {
    mainContainer.scrollTop = 0;
  }
  
  // Force scroll on all potentially scrollable elements
  const scrollableElements = document.querySelectorAll('[style*="overflow"]');
  scrollableElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.scrollTop = 0;
    }
  });
}