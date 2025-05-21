const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Function to generate PDF from resume data
const generatePDF = async (resumeData) => {
  try {
    // In a production environment, you would use a proper HTML template
    // For this example, we'll create a simple HTML string based on the template
    let templateHtml = '';
    
    switch (resumeData.template) {
      case 'creative':
        templateHtml = fs.readFileSync(path.resolve(__dirname, '../templates/creative.html'), 'utf8');
        break;
      case 'minimal':
        templateHtml = fs.readFileSync(path.resolve(__dirname, '../templates/minimal.html'), 'utf8');
        break;
      case 'professional':
      default:
        templateHtml = fs.readFileSync(path.resolve(__dirname, '../templates/professional.html'), 'utf8');
        break;
    }
    
    // Compile the template
    const template = handlebars.compile(templateHtml);
    
    // Render the template with the resume data
    const html = template(resumeData);
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set the page content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });
    
    // Close the browser
    await browser.close();
    
    return {
      success: true,
      data: pdf
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: 'Failed to generate PDF'
    };
  }
};

module.exports = {
  generatePDF
};