import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollHandler from "@/components/ScrollHandler";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

// Import all screens
import SplashScreen from "@/pages/SplashScreen";
import PhoneLoginScreen from "@/pages/PhoneLoginScreen";
import OTPVerificationScreen from "@/pages/OTPVerificationScreen";
import AccountSetupScreen from "@/pages/AccountSetupScreen";
import CharterScreen from "@/pages/CharterScreen";
import OwnershipHomeScreen from "@/pages/OwnershipHomeScreen";
import OwnershipOpportunitiesScreen from "@/pages/OwnershipOpportunitiesScreen";
import FuelWalletScreen from "@/pages/FuelWalletScreen";
import NotificationCenterScreen from "@/pages/NotificationCenterScreen";
import UserProfileScreen from "@/pages/UserProfileScreen";
import YachtDetailsScreen from "@/pages/YachtDetailsScreen";
import BookingCheckoutScreen from "@/pages/BookingCheckoutScreen";
import BookingConfirmationScreen from "@/pages/BookingConfirmationScreen";
import MyBookingsScreen from "@/pages/MyBookingsScreen";
import ReservationDetailScreen from "@/pages/ReservationDetailScreen";
import YachtOwnershipDetailScreen from "@/pages/YachtOwnershipDetailScreen";
import OwnershipInquiryScreen from "@/pages/OwnershipInquiryScreen";
import ShareMarketplaceScreen from "@/pages/ShareMarketplaceScreen";
import ShareListingDetailScreen from "@/pages/ShareListingDetailScreen";
import ListShareForSaleScreen from "@/pages/ListShareForSaleScreen";
import SharePurchaseConfirmationScreen from "@/pages/SharePurchaseConfirmationScreen";
import OwnerDashboardScreen from "@/pages/OwnerDashboardScreen";
import BoatManagementScreen from "@/pages/BoatManagementScreen";
import AddBoatListingScreen from "@/pages/AddBoatListingScreen";
import BoatCalendarScreen from "@/pages/BoatCalendarScreen";
import WaitlistManagementScreen from "@/pages/WaitlistManagementScreen";
import MessagingCenterScreen from "@/pages/MessagingCenterScreen";
import ChatThreadScreen from "@/pages/ChatThreadScreen";
import EditProfileScreen from "@/pages/EditProfileScreen";
import SettingsScreen from "@/pages/SettingsScreen";
import TopUpScreen from "@/pages/TopUpScreen";
import DashboardScreen from "@/pages/DashboardScreen";
import DevNavigationScreen from "@/pages/DevNavigationScreen";
import MyBoatsScreen from "@/pages/MyBoatsScreen";
import BoatOwnershipManagementScreen from "@/pages/BoatOwnershipManagementScreen";
import BookingCalendarScreen from "@/pages/BookingCalendarScreen";
import ShareTradingScreen from "@/pages/ShareTradingScreen";
import RedirectToOwnership from "@/components/RedirectToOwnership";
import ScrollToTopOnRoute from "@/components/ScrollToTopOnRoute";

function Router() {
  // Force scroll to top on any route change
  const [location] = useLocation();
  
  // Handle redirects and scroll to top
  useEffect(() => {
    // Immediate redirect if landing on /hone
    if (location === '/hone') {
      console.log('Detected /hone route, redirecting to /');
      window.history.replaceState({}, '', '/');
      window.location.href = '/';
      return;
    }
    
    // Force scroll to top for all route changes
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Also try the root element
      const root = document.getElementById('root');
      if (root) root.scrollTop = 0;
    };
    
    // Immediate scroll
    scrollToTop();
    
    // Multiple attempts to ensure it works across all browsers/devices
    requestAnimationFrame(scrollToTop);
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 200);
  }, [location]);

  return (
    <>
      <ScrollToTopOnRoute />
      <Switch>
        <Route path="/" component={OwnershipHomeScreen} />
        <Route path="/hone" component={OwnershipHomeScreen} />
        <Route path="/home" component={OwnershipHomeScreen} />
        <Route path="/splash" component={SplashScreen} />
        <Route path="/login" component={PhoneLoginScreen} />
        <Route path="/verify-otp" component={OTPVerificationScreen} />
        <Route path="/account-setup" component={AccountSetupScreen} />
        <Route path="/charter" component={CharterScreen} />
        <Route path="/ownership-home" component={OwnershipHomeScreen} />
        <Route path="/ownership-opportunities" component={OwnershipOpportunitiesScreen} />
        <Route path="/fuel-wallet" component={FuelWalletScreen} />
        <Route path="/notifications" component={NotificationCenterScreen} />
        <Route path="/profile" component={UserProfileScreen} />
        <Route path="/yacht-details/:id" component={YachtDetailsScreen} />
        <Route path="/booking/:id" component={BookingCheckoutScreen} />
        <Route path="/booking-checkout" component={BookingCheckoutScreen} />
        <Route path="/booking-confirmation" component={BookingConfirmationScreen} />
        <Route path="/my-bookings" component={MyBookingsScreen} />
        <Route path="/reservation-detail/:id" component={ReservationDetailScreen} />
        <Route path="/ownership/:id" component={YachtOwnershipDetailScreen} />
        <Route path="/ownership-inquiry/:id" component={OwnershipInquiryScreen} />
        <Route path="/share-marketplace" component={ShareMarketplaceScreen} />
        <Route path="/share-listing/:id" component={ShareListingDetailScreen} />
        <Route path="/list-share-for-sale" component={ListShareForSaleScreen} />
        <Route path="/share-purchase-confirmation/:id" component={SharePurchaseConfirmationScreen} />
        <Route path="/owner-dashboard" component={OwnerDashboardScreen} />
        <Route path="/boat-management/:id" component={BoatManagementScreen} />
        <Route path="/add-boat-listing" component={AddBoatListingScreen} />
        <Route path="/boat-calendar/:id" component={BoatCalendarScreen} />
        <Route path="/waitlist-management" component={WaitlistManagementScreen} />
        <Route path="/messages" component={MessagingCenterScreen} />
        <Route path="/chat/:id" component={ChatThreadScreen} />
        <Route path="/edit-profile" component={EditProfileScreen} />
        <Route path="/settings" component={SettingsScreen} />
        <Route path="/top-up" component={TopUpScreen} />
        <Route path="/dashboard" component={DashboardScreen} />
        <Route path="/dev-navigation" component={DevNavigationScreen} />
        <Route path="/my-boats" component={MyBoatsScreen} />
        <Route path="/boat-ownership/:id" component={BoatOwnershipManagementScreen} />
        <Route path="/booking-calendar/:id" component={BookingCalendarScreen} />
        <Route path="/share-trading" component={ShareTradingScreen} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
