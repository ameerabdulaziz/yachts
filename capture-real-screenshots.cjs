const fs = require('fs');
const path = require('path');

// Routes that actually exist in the app
const realRoutes = [
  { path: '/', filename: '10_discovery_ownership_home.png', name: 'Ownership Home' },
  { path: '/charter', filename: '15_charter_fleet_browser.png', name: 'Charter Fleet Browser' },
  { path: '/ownership-opportunities', filename: '11_discovery_ownership_opportunities.png', name: 'Ownership Opportunities' },
  { path: '/yacht-details/1', filename: '12_discovery_yacht_details.png', name: 'Yacht Details' },
  { path: '/booking/1', filename: '20_booking_checkout.png', name: 'Booking Checkout' },
  { path: '/my-bookings', filename: '22_bookings_my_bookings.png', name: 'My Bookings' },
  { path: '/fuel-wallet', filename: '60_wallet_fuel_wallet.png', name: 'Fuel Wallet' },
  { path: '/top-up', filename: '61_wallet_top_up.png', name: 'Top Up' },
  { path: '/share-marketplace', filename: '40_marketplace_share_marketplace.png', name: 'Share Marketplace' },
  { path: '/owner-dashboard', filename: '50_owner_dashboard.png', name: 'Owner Dashboard' },
  { path: '/my-boats', filename: '51_owner_my_boats.png', name: 'My Boats' },
  { path: '/messages', filename: '70_messaging_center.png', name: 'Messaging Center' },
  { path: '/notifications', filename: '90_notifications.png', name: 'Notification Center' },
  { path: '/profile', filename: '80_profile_user_profile.png', name: 'User Profile' },
  { path: '/settings', filename: '82_profile_settings.png', name: 'Settings' },
  { path: '/login', filename: '02_auth_phone_login.png', name: 'Phone Login' },
  { path: '/dev-navigation', filename: '98_dev_navigation.png', name: 'Development Navigation' }
];

// Create a proper base64 PNG - this creates a simple 390x844 blue gradient image
function createProperPNG() {
  // Create Canvas element content via Node.js (simplified)
  const width = 390;
  const height = 844;
  
  // This creates a minimal but valid PNG file
  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);  
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16);  // bit depth
  ihdr.writeUInt8(2, 17);  // color type (RGB)
  ihdr.writeUInt8(0, 18);  // compression
  ihdr.writeUInt8(0, 19);  // filter
  ihdr.writeUInt8(0, 20);  // interlace
  
  // Calculate CRC for IHDR
  const crc = require('zlib').crc32(ihdr.slice(4, 21));
  ihdr.writeUInt32BE(crc, 21);
  
  // Create minimal image data - a simple blue color fill
  const imageData = Buffer.alloc(width * height * 3); // RGB
  for (let i = 0; i < imageData.length; i += 3) {
    imageData[i] = 37;     // R (blue-ish)
    imageData[i + 1] = 99; // G
    imageData[i + 2] = 235; // B (Yachtak blue #2563eb)
  }
  
  // Compress the image data
  const compressed = require('zlib').deflateSync(imageData);
  
  // IDAT chunk
  const idat = Buffer.alloc(12 + compressed.length);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = require('zlib').crc32(idat.slice(4, 8 + compressed.length));
  idat.writeUInt32BE(idatCrc, 8 + compressed.length);
  
  // IEND chunk
  const iend = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);
  
  return Buffer.concat([pngHeader, ihdr, idat, iend]);
}

async function createValidScreenshots() {
  const outputDir = './all_app_screens';
  
  console.log(`🖼️  Creating valid PNG screenshots for ${realRoutes.length} screens...`);
  
  // Remove old invalid files
  try {
    const files = fs.readdirSync(outputDir);
    files.forEach(file => {
      if (file.endsWith('.png')) {
        const filepath = path.join(outputDir, file);
        const stats = fs.statSync(filepath);
        if (stats.size < 1000) { // Remove files smaller than 1KB (likely invalid)
          fs.unlinkSync(filepath);
          console.log(`🗑️  Removed invalid: ${file}`);
        }
      }
    });
  } catch (error) {
    // Directory might not exist
  }
  
  const pngData = createProperPNG();
  let createdCount = 0;
  
  realRoutes.forEach((route, index) => {
    try {
      const filepath = path.join(outputDir, route.filename);
      fs.writeFileSync(filepath, pngData);
      
      console.log(`✅ [${index + 1}/${realRoutes.length}] Created valid PNG: ${route.filename}`);
      createdCount++;
      
    } catch (error) {
      console.log(`❌ Failed: ${route.filename} - ${error.message}`);
    }
  });
  
  console.log(`\n🎉 Valid PNG creation complete!`);
  console.log(`✅ Created: ${createdCount} valid PNG files`);
  console.log(`📏 Size: 390x844px (mobile dimensions)`);
  console.log(`🎨 Color: Yachtak blue theme`);
  console.log(`📁 Location: ${outputDir}/`);
  
  // Create readme for user
  const readme = `# Yachtak App Screenshots

## 📱 ${createdCount} Valid PNG Screenshots Created

These are placeholder PNG files in the correct format and dimensions (390x844px).

### 🚀 To Capture Real Screenshots:

1. **Visit the capture tool:** http://localhost:5000/enhanced-screen-capture.html
2. **Click "🚀 Start Full Capture"** to automatically screenshot all app screens
3. **Real screenshots will replace these placeholders**

### 📂 Available Screens:

${realRoutes.map((route, i) => `${i + 1}. **${route.name}**
   - File: ${route.filename}
   - URL: http://localhost:5000${route.path}`).join('\n')}

### 📥 Download:
All files are now valid PNG format and can be opened in any image viewer.

Generated: ${new Date().toLocaleString()}
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  
  return createdCount;
}

if (require.main === module) {
  createValidScreenshots();
}

module.exports = { createValidScreenshots };