const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function convertHTMLToPDF() {
  console.log('Starting PDF conversion...');
  
  try {
    // Launch browser with more compatibility options
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-web-security',
        '--no-first-run',
        '--no-default-browser-check',
        '--single-process'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
    });
    
    const page = await browser.newPage();
    
    // Read the HTML file
    const htmlPath = path.join(__dirname, 'presentation.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF with optimized settings for presentation
    const pdf = await page.pdf({
      path: 'Yachtak_Platform_Presentation.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>', // Empty header
      footerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
          <span>Yachtak Platform - Comprehensive Application Overview | Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
      scale: 0.8 // Slightly smaller scale for better fitting
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully: Yachtak_Platform_Presentation.pdf');
    console.log(`📄 PDF file size: ${(pdf.length / 1024 / 1024).toFixed(2)} MB`);
    
    return pdf;
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

// Run the conversion
convertHTMLToPDF();