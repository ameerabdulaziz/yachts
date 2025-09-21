const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  console.log('🎯 Starting screenshot capture for Yachtak presentation...');
  
  let browser;
  try {
    // Launch browser with minimal setup
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--no-first-run'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Create screenshots directory
    const screenshotDir = 'screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir);
    }
    
    const baseUrl = 'http://localhost:5000';
    const delay = 3000; // 3 seconds delay to let pages load
    
    const screens = [
      { name: '01_homepage', path: '/', title: 'Homepage - Ownership Home' },
      { name: '02_yacht_fleet', path: '/charter', title: 'Yacht Fleet - Charter Screen' },
      { name: '03_ownership_opportunities', path: '/ownership-opportunities', title: 'Ownership Opportunities' },
      { name: '04_yacht_details', path: '/yacht-details/1', title: 'Yacht Details Page' },
      { name: '05_booking_checkout', path: '/booking-checkout', title: 'Booking Checkout' },
      { name: '06_fuel_wallet', path: '/fuel-wallet', title: 'Fuel Wallet Dashboard' },
      { name: '07_fuel_topup', path: '/top-up', title: 'Fuel Top-Up Interface' },
      { name: '08_share_marketplace', path: '/share-marketplace', title: 'Share Trading Marketplace' },
      { name: '09_my_bookings', path: '/my-bookings', title: 'My Bookings Management' },
      { name: '10_owner_dashboard', path: '/owner-dashboard', title: 'Owner Dashboard' },
      { name: '11_my_boats', path: '/my-boats', title: 'My Boats Management' },
      { name: '12_messaging', path: '/messages', title: 'Messaging Center' },
      { name: '13_notifications', path: '/notifications', title: 'Notification Center' },
      { name: '14_profile', path: '/profile', title: 'User Profile' },
      { name: '15_settings', path: '/settings', title: 'User Settings' },
      { name: '16_login', path: '/login', title: 'Login Screen' },
      { name: '17_share_listing', path: '/share-listing/1', title: 'Share Listing Detail' },
      { name: '18_boat_management', path: '/boat-management/1', title: 'Boat Management' },
      { name: '19_dev_navigation', path: '/dev-navigation', title: 'Navigation Overview' }
    ];
    
    console.log(`📸 Capturing ${screens.length} screenshots...`);
    
    for (let i = 0; i < screens.length; i++) {
      const screen = screens[i];
      try {
        console.log(`📷 [${i + 1}/${screens.length}] Capturing: ${screen.title}`);
        
        // Navigate to the page
        const fullUrl = `${baseUrl}${screen.path}`;
        await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        // Wait for content to load
        await page.waitForTimeout(delay);
        
        // Take screenshot
        const screenshotPath = path.join(screenshotDir, `${screen.name}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
          captureBeyondViewport: true
        });
        
        console.log(`✅ Saved: ${screenshotPath}`);
        
      } catch (error) {
        console.log(`⚠️  Could not capture ${screen.name}: ${error.message}`);
      }
    }
    
    console.log('🎉 Screenshot capture completed!');
    console.log(`📁 Screenshots saved in: ${path.resolve(screenshotDir)}`);
    
    // List captured files
    const files = fs.readdirSync(screenshotDir);
    console.log(`📊 Total screenshots captured: ${files.length}`);
    
  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the capture
captureScreenshots();