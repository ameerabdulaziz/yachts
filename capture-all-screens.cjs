const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Complete route manifest with organized naming scheme
const routeManifest = [
  // Authentication & Onboarding (01-04)
  { path: '/splash', filename: '01_auth_splash.png', name: 'Splash Screen' },
  { path: '/login', filename: '02_auth_phone_login.png', name: 'Phone Login' },
  { path: '/verify-otp', filename: '03_auth_otp_verification.png', name: 'OTP Verification' },
  { path: '/account-setup', filename: '04_auth_account_setup.png', name: 'Account Setup' },

  // Discovery & Home (10-12)
  { path: '/', filename: '10_discovery_ownership_home.png', name: 'Ownership Home' },
  { path: '/ownership-opportunities', filename: '11_discovery_ownership_opportunities.png', name: 'Ownership Opportunities' },
  { path: '/yacht-details/1', filename: '12_discovery_yacht_details.png', name: 'Yacht Details' },

  // Charter & Fleet (15-16)
  { path: '/charter', filename: '15_charter_fleet_browser.png', name: 'Charter Fleet Browser' },

  // Booking System (20-23)
  { path: '/booking/1', filename: '20_booking_checkout.png', name: 'Booking Checkout' },
  { path: '/booking-confirmation', filename: '21_booking_confirmation.png', name: 'Booking Confirmation' },
  { path: '/my-bookings', filename: '22_bookings_my_bookings.png', name: 'My Bookings' },
  { path: '/reservation-detail/1', filename: '23_bookings_reservation_detail.png', name: 'Reservation Detail' },

  // Ownership Management (30-32)
  { path: '/ownership/1', filename: '30_ownership_detail.png', name: 'Yacht Ownership Detail' },
  { path: '/ownership-inquiry/1', filename: '31_ownership_inquiry.png', name: 'Ownership Inquiry' },
  { path: '/inquiry-thank-you', filename: '32_ownership_inquiry_thank_you.png', name: 'Inquiry Thank You' },

  // Share Trading Marketplace (40-44)
  { path: '/share-marketplace', filename: '40_marketplace_share_marketplace.png', name: 'Share Marketplace' },
  { path: '/share-listing/1', filename: '41_marketplace_share_listing_detail.png', name: 'Share Listing Detail' },
  { path: '/list-share-for-sale', filename: '42_marketplace_list_share_for_sale.png', name: 'List Share for Sale' },
  { path: '/share-purchase-confirmation/1', filename: '43_marketplace_share_purchase_confirmation.png', name: 'Share Purchase Confirmation' },
  { path: '/share-trading', filename: '44_marketplace_share_trading.png', name: 'Share Trading' },

  // Owner Dashboard & Management (50-57)
  { path: '/owner-dashboard', filename: '50_owner_dashboard.png', name: 'Owner Dashboard' },
  { path: '/my-boats', filename: '51_owner_my_boats.png', name: 'My Boats' },
  { path: '/boat-management/1', filename: '52_owner_boat_management.png', name: 'Boat Management' },
  { path: '/add-boat-listing', filename: '53_owner_add_boat_listing.png', name: 'Add Boat Listing' },
  { path: '/boat-calendar/1', filename: '54_owner_boat_calendar.png', name: 'Boat Calendar' },
  { path: '/boat-ownership/1', filename: '55_owner_boat_ownership_management.png', name: 'Boat Ownership Management' },
  { path: '/booking-calendar/1', filename: '56_owner_booking_calendar.png', name: 'Booking Calendar' },
  { path: '/waitlist-management', filename: '57_owner_waitlist_management.png', name: 'Waitlist Management' },

  // Fuel Wallet System (60-61)
  { path: '/fuel-wallet', filename: '60_wallet_fuel_wallet.png', name: 'Fuel Wallet' },
  { path: '/top-up', filename: '61_wallet_top_up.png', name: 'Top Up' },

  // Communication & Messaging (70-71)
  { path: '/messages', filename: '70_messaging_center.png', name: 'Messaging Center' },
  { path: '/chat/1', filename: '71_chat_thread.png', name: 'Chat Thread' },

  // Profile & Settings (80-82)
  { path: '/profile', filename: '80_profile_user_profile.png', name: 'User Profile' },
  { path: '/edit-profile', filename: '81_profile_edit_profile.png', name: 'Edit Profile' },
  { path: '/settings', filename: '82_profile_settings.png', name: 'Settings' },

  // Notifications & Dashboard (90-99)
  { path: '/notifications', filename: '90_notifications.png', name: 'Notification Center' },
  { path: '/dashboard', filename: '99_dashboard.png', name: 'Dashboard' },

  // Development & Utility (98-97)
  { path: '/dev-navigation', filename: '98_dev_navigation.png', name: 'Development Navigation' }
];

async function captureAllScreens() {
  const outputDir = './yachtak_app_screens_complete';
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Starting comprehensive app screen capture...');
  console.log(`📱 Will capture ${routeManifest.length} screens`);

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  // Set mobile viewport (iPhone 14 dimensions)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });

  // Hide scrollbars for cleaner screenshots
  await page.addStyleTag({
    content: `
      ::-webkit-scrollbar { display: none; }
      body { -ms-overflow-style: none; scrollbar-width: none; }
    `
  });

  const results = [];
  const failed = [];

  for (let i = 0; i < routeManifest.length; i++) {
    const route = routeManifest[i];
    console.log(`📸 Capturing ${i + 1}/${routeManifest.length}: ${route.name} (${route.path})`);

    try {
      // Navigate to the route
      await page.goto(`http://localhost:5000${route.path}`, {
        waitUntil: 'networkidle0',
        timeout: 10000
      });

      // Wait a bit for any animations or async loading
      await page.waitForTimeout(2000);

      // Try to wait for a main container or body to be loaded
      try {
        await page.waitForSelector('body', { timeout: 3000 });
      } catch (e) {
        console.log(`  ⚠️  No body selector found for ${route.path}, continuing...`);
      }

      // Take screenshot
      const screenshotPath = path.join(outputDir, route.filename);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: 'png'
      });

      results.push({
        ...route,
        status: 'success',
        timestamp: new Date().toISOString()
      });

      console.log(`  ✅ Saved: ${route.filename}`);

    } catch (error) {
      console.log(`  ❌ Failed: ${route.name} - ${error.message}`);
      failed.push({
        ...route,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Small delay between captures
    await page.waitForTimeout(500);
  }

  await browser.close();

  // Create manifest file
  const manifest = {
    captureDate: new Date().toISOString(),
    totalScreens: routeManifest.length,
    successfulCaptures: results.length,
    failedCaptures: failed.length,
    results: results,
    failed: failed
  };

  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Create README file
  const readme = `# Yachtak Application Screenshots - Complete Collection

## Overview
This folder contains ${results.length} high-quality PNG screenshots from all screens of the Yachtak yacht platform application.

## Capture Details
- **Capture Date:** ${manifest.captureDate}
- **Total Screens:** ${manifest.totalScreens}
- **Successful Captures:** ${manifest.successfulCaptures}
- **Failed Captures:** ${manifest.failedCaptures}
- **Device:** Mobile viewport (iPhone 14 - 390x844px)
- **Format:** PNG (Full page screenshots)

## Screen Categories

### 🔐 Authentication & Onboarding (01-04)
- Splash Screen
- Phone Login  
- OTP Verification
- Account Setup

### 🏠 Discovery & Home (10-12)
- Ownership Home
- Ownership Opportunities
- Yacht Details

### ⛵ Charter & Fleet (15-16) 
- Charter Fleet Browser

### 📅 Booking System (20-23)
- Booking Checkout
- Booking Confirmation
- My Bookings
- Reservation Detail

### 🏖️ Ownership Management (30-32)
- Yacht Ownership Detail
- Ownership Inquiry
- Inquiry Thank You

### 💰 Share Trading Marketplace (40-44)
- Share Marketplace
- Share Listing Detail
- List Share for Sale
- Share Purchase Confirmation
- Share Trading

### 👑 Owner Dashboard & Management (50-57)
- Owner Dashboard
- My Boats
- Boat Management
- Add Boat Listing
- Boat Calendar
- Boat Ownership Management
- Booking Calendar
- Waitlist Management

### ⛽ Fuel Wallet System (60-61)
- Fuel Wallet
- Top Up

### 💬 Communication & Messaging (70-71)
- Messaging Center
- Chat Thread

### 👤 Profile & Settings (80-82)
- User Profile
- Edit Profile
- Settings

### 🔔 Notifications & Dashboard (90-99)
- Notification Center
- Dashboard

### 🛠️ Development & Utility (98-97)
- Development Navigation

## File Naming Convention
Files are numbered and grouped by functional area:
- **01-04:** Authentication & Onboarding
- **10-19:** Discovery & Home
- **20-29:** Booking System
- **30-39:** Ownership Management
- **40-49:** Share Trading Marketplace
- **50-59:** Owner Dashboard & Management
- **60-69:** Fuel Wallet System
- **70-79:** Communication & Messaging
- **80-89:** Profile & Settings
- **90-99:** Notifications & Dashboard

Generated: ${new Date().toLocaleDateString()}
Source: Yachtak Platform - Complete Application Screenshot Collection
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);

  // Create index.html preview
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yachtak App Screenshots - Complete Collection</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { text-align: center; margin-bottom: 40px; }
        .stats { display: flex; justify-content: center; gap: 20px; margin: 20px 0; }
        .stat { background: white; padding: 15px; border-radius: 8px; text-align: center; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .screen-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .screen-image { width: 100%; height: 200px; object-fit: cover; }
        .screen-info { padding: 15px; }
        .screen-title { font-weight: bold; margin-bottom: 5px; color: #2563eb; }
        .screen-path { font-size: 0.9em; color: #666; font-family: monospace; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📱 Yachtak Application Screenshots</h1>
        <p>Complete collection of all application screens</p>
        <div class="stats">
            <div class="stat"><strong>${manifest.successfulCaptures}</strong><br>Screenshots</div>
            <div class="stat"><strong>${manifest.totalScreens}</strong><br>Total Screens</div>
            <div class="stat"><strong>Mobile</strong><br>Optimized</div>
        </div>
    </div>
    <div class="gallery">
        ${results.map(screen => `
            <div class="screen-card">
                <img src="./${screen.filename}" alt="${screen.name}" class="screen-image">
                <div class="screen-info">
                    <div class="screen-title">${screen.name}</div>
                    <div class="screen-path">${screen.path}</div>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

  console.log(`\n🎉 Screenshot capture complete!`);
  console.log(`📊 Results:`);
  console.log(`   ✅ Successful: ${results.length}`);
  console.log(`   ❌ Failed: ${failed.length}`);
  console.log(`📁 Output: ${outputDir}/`);
  console.log(`📋 Manifest: ${outputDir}/manifest.json`);
  console.log(`🌐 Preview: ${outputDir}/index.html`);

  if (failed.length > 0) {
    console.log(`\n⚠️  Failed captures:`);
    failed.forEach(f => console.log(`   - ${f.name} (${f.path}): ${f.error}`));
  }
}

if (require.main === module) {
  captureAllScreens().catch(console.error);
}

module.exports = { captureAllScreens, routeManifest };