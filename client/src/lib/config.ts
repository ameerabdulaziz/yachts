// API configuration for Node.js backend (working backend)
export const API_CONFIG = {
  BASE_URL: '', // Use relative URLs to avoid CORS issues
  ENDPOINTS: {
    YACHTS: '/api/yachts',
    USERS: '/api/users', 
    BOOKINGS: '/api/bookings',
    OWNERSHIP_OPPORTUNITIES: '/api/ownership-opportunities',
    MESSAGES: '/api/messages',
    FUEL_TRANSACTIONS: '/api/fuel-transactions'
  }
};

// Helper function to build API URLs
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}