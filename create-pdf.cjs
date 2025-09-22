const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function createPresentationPDF() {
  console.log('🎯 Creating PDF version of Yachtak presentation...');
  
  let browser;
  try {
    // Launch browser with minimal setup for PDF generation
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
    
    // Wait for local server and load the presentation
    console.log('📄 Loading presentation from local server...');
    await page.goto('http://localhost:5000/presentation', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait a bit more for all images and styles to load
    await page.waitForTimeout(3000);
    
    console.log('🖨️  Generating PDF...');
    
    // Generate PDF with optimal settings for presentations
    const pdf = await page.pdf({
      path: 'Yachtak_Commercial_Presentation.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: true
    });
    
    console.log('✅ PDF created successfully: Yachtak_Commercial_Presentation.pdf');
    console.log(`📁 File size: ${(fs.statSync('Yachtak_Commercial_Presentation.pdf').size / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Error creating PDF:', error.message);
    
    // Fallback: Create from static HTML file
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.log('🔄 Server not available, trying static HTML file...');
      
      const page = await browser.newPage();
      const htmlPath = path.resolve('Yachtak_Commercial_Presentation.html');
      await page.goto(`file://${htmlPath}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      
      await page.pdf({
        path: 'Yachtak_Commercial_Presentation.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in', 
          bottom: '0.5in',
          left: '0.5in'
        }
      });
      
      console.log('✅ PDF created from static HTML file');
    }
    
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the PDF creation
createPresentationPDF();