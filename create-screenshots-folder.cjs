const fs = require('fs');
const path = require('path');

// Route manifest for all 38+ screens
const routeManifest = [
  // Authentication & Onboarding (01-04)
  { path: '/splash', filename: '01_auth_splash.png', name: 'Splash Screen', category: 'Authentication' },
  { path: '/login', filename: '02_auth_phone_login.png', name: 'Phone Login', category: 'Authentication' },
  { path: '/verify-otp', filename: '03_auth_otp_verification.png', name: 'OTP Verification', category: 'Authentication' },
  { path: '/account-setup', filename: '04_auth_account_setup.png', name: 'Account Setup', category: 'Authentication' },

  // Discovery & Home (10-12)
  { path: '/', filename: '10_discovery_ownership_home.png', name: 'Ownership Home', category: 'Discovery' },
  { path: '/ownership-opportunities', filename: '11_discovery_ownership_opportunities.png', name: 'Ownership Opportunities', category: 'Discovery' },
  { path: '/yacht-details/1', filename: '12_discovery_yacht_details.png', name: 'Yacht Details', category: 'Discovery' },

  // Charter & Fleet (15-16)
  { path: '/charter', filename: '15_charter_fleet_browser.png', name: 'Charter Fleet Browser', category: 'Charter' },

  // Booking System (20-23)
  { path: '/booking/1', filename: '20_booking_checkout.png', name: 'Booking Checkout', category: 'Booking' },
  { path: '/booking-confirmation', filename: '21_booking_confirmation.png', name: 'Booking Confirmation', category: 'Booking' },
  { path: '/my-bookings', filename: '22_bookings_my_bookings.png', name: 'My Bookings', category: 'Booking' },
  { path: '/reservation-detail/1', filename: '23_bookings_reservation_detail.png', name: 'Reservation Detail', category: 'Booking' },

  // Ownership Management (30-32)
  { path: '/ownership/1', filename: '30_ownership_detail.png', name: 'Yacht Ownership Detail', category: 'Ownership' },
  { path: '/ownership-inquiry/1', filename: '31_ownership_inquiry.png', name: 'Ownership Inquiry', category: 'Ownership' },
  { path: '/inquiry-thank-you', filename: '32_ownership_inquiry_thank_you.png', name: 'Inquiry Thank You', category: 'Ownership' },

  // Share Trading Marketplace (40-44)
  { path: '/share-marketplace', filename: '40_marketplace_share_marketplace.png', name: 'Share Marketplace', category: 'Marketplace' },
  { path: '/share-listing/1', filename: '41_marketplace_share_listing_detail.png', name: 'Share Listing Detail', category: 'Marketplace' },
  { path: '/list-share-for-sale', filename: '42_marketplace_list_share_for_sale.png', name: 'List Share for Sale', category: 'Marketplace' },
  { path: '/share-purchase-confirmation/1', filename: '43_marketplace_share_purchase_confirmation.png', name: 'Share Purchase Confirmation', category: 'Marketplace' },
  { path: '/share-trading', filename: '44_marketplace_share_trading.png', name: 'Share Trading', category: 'Marketplace' },

  // Owner Dashboard & Management (50-57)
  { path: '/owner-dashboard', filename: '50_owner_dashboard.png', name: 'Owner Dashboard', category: 'Owner Management' },
  { path: '/my-boats', filename: '51_owner_my_boats.png', name: 'My Boats', category: 'Owner Management' },
  { path: '/boat-management/1', filename: '52_owner_boat_management.png', name: 'Boat Management', category: 'Owner Management' },
  { path: '/add-boat-listing', filename: '53_owner_add_boat_listing.png', name: 'Add Boat Listing', category: 'Owner Management' },
  { path: '/boat-calendar/1', filename: '54_owner_boat_calendar.png', name: 'Boat Calendar', category: 'Owner Management' },
  { path: '/boat-ownership/1', filename: '55_owner_boat_ownership_management.png', name: 'Boat Ownership Management', category: 'Owner Management' },
  { path: '/booking-calendar/1', filename: '56_owner_booking_calendar.png', name: 'Booking Calendar', category: 'Owner Management' },
  { path: '/waitlist-management', filename: '57_owner_waitlist_management.png', name: 'Waitlist Management', category: 'Owner Management' },

  // Fuel Wallet System (60-61)
  { path: '/fuel-wallet', filename: '60_wallet_fuel_wallet.png', name: 'Fuel Wallet', category: 'Wallet' },
  { path: '/top-up', filename: '61_wallet_top_up.png', name: 'Top Up', category: 'Wallet' },

  // Communication & Messaging (70-71)
  { path: '/messages', filename: '70_messaging_center.png', name: 'Messaging Center', category: 'Communication' },
  { path: '/chat/1', filename: '71_chat_thread.png', name: 'Chat Thread', category: 'Communication' },

  // Profile & Settings (80-82)
  { path: '/profile', filename: '80_profile_user_profile.png', name: 'User Profile', category: 'Profile' },
  { path: '/edit-profile', filename: '81_profile_edit_profile.png', name: 'Edit Profile', category: 'Profile' },
  { path: '/settings', filename: '82_profile_settings.png', name: 'Settings', category: 'Profile' },

  // Notifications & Dashboard (90-99)
  { path: '/notifications', filename: '90_notifications.png', name: 'Notification Center', category: 'Notifications' },
  { path: '/dashboard', filename: '99_dashboard.png', name: 'Dashboard', category: 'Dashboard' },

  // Development & Utility (98-97)
  { path: '/dev-navigation', filename: '98_dev_navigation.png', name: 'Development Navigation', category: 'Development' }
];

function createScreenshotsFolder() {
  const outputDir = './all_app_screens';
  
  // Create main directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📁 Creating folder structure for ${routeManifest.length} app screens...`);

  // Group routes by category for better organization
  const categories = {};
  routeManifest.forEach(route => {
    if (!categories[route.category]) {
      categories[route.category] = [];
    }
    categories[route.category].push(route);
  });

  // Create category subdirectories
  Object.keys(categories).forEach(category => {
    const categoryDir = path.join(outputDir, category.toLowerCase().replace(/\s+/g, '_'));
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
  });

  // Create manifest for the capture process
  const manifest = {
    created: new Date().toISOString(),
    totalScreens: routeManifest.length,
    routes: routeManifest,
    categories: Object.keys(categories).map(cat => ({
      name: cat,
      count: categories[cat].length,
      screens: categories[cat].map(r => r.name)
    }))
  };

  // Save manifest
  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Create instructions file
  const instructions = `# Yachtak App Screenshots Collection

## How to Capture All Screens:

### Method 1: Automated Web Tool
1. Open: http://localhost:5000/screen-capture.html
2. Click "🚀 Start Capture" 
3. Wait for all ${routeManifest.length} screens to be captured
4. Click "📦 Download All"
5. Move downloaded PNG files to this folder

### Method 2: Manual Capture
For each screen listed below, visit the URL and take a screenshot:

## All ${routeManifest.length} Application Screens:

${Object.keys(categories).map(category => `
### ${category} (${categories[category].length} screens)
${categories[category].map(route => `- **${route.name}**
  - URL: http://localhost:5000${route.path}
  - Save as: ${route.filename}`).join('\n')}
`).join('\n')}

## File Organization:
- Screenshots should be saved in the main folder
- Use the exact filename shown above for each screen
- All files will be PNG format (mobile-optimized 390x844px)

## Categories:
${Object.keys(categories).map(cat => `- **${cat}**: ${categories[cat].length} screens`).join('\n')}

Total: ${routeManifest.length} unique application screens
Generated: ${new Date().toLocaleString()}
`;

  fs.writeFileSync(path.join(outputDir, 'INSTRUCTIONS.txt'), instructions);

  // Create placeholder files so user knows what to capture
  routeManifest.forEach(route => {
    const placeholderPath = path.join(outputDir, route.filename.replace('.png', '_PLACEHOLDER.txt'));
    const placeholderContent = `SCREENSHOT NEEDED: ${route.name}

URL: http://localhost:5000${route.path}
Category: ${route.category}
Expected filename: ${route.filename}

To capture this screen:
1. Visit the URL above in your browser
2. Take a screenshot (mobile view recommended)
3. Save as "${route.filename}" in the all_app_screens folder
4. Delete this placeholder file

Generated: ${new Date().toISOString()}`;
    
    fs.writeFileSync(placeholderPath, placeholderContent);
  });

  console.log(`✅ Created folder structure:`);
  console.log(`   📁 Main folder: ${outputDir}/`);
  console.log(`   📋 Manifest: manifest.json`);
  console.log(`   📝 Instructions: INSTRUCTIONS.txt`);
  console.log(`   🎯 ${routeManifest.length} placeholder files created`);
  console.log(`   📂 ${Object.keys(categories).length} category subdirectories`);
  
  console.log(`\n🚀 Next steps:`);
  console.log(`   1. Use the web capture tool: http://localhost:5000/screen-capture.html`);
  console.log(`   2. Or follow manual instructions in INSTRUCTIONS.txt`);
  console.log(`   3. All screenshots will be ready for download!`);

  return outputDir;
}

if (require.main === module) {
  createScreenshotsFolder();
}

module.exports = { createScreenshotsFolder, routeManifest };