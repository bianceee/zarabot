import puppeteer from 'puppeteer';

async function scraping(url) {
    // const browser = await puppeteer.launch({headless: false, slowMo: 250, devtools: true }); // Pour debugger
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    await page.goto(url, { waitUntil: "networkidle2" });
  
  
    const bodyHandle = await page.$('body');
  
    let data = await page.evaluate((body) => {
    	const product = [];
			const offers = document.querySelectorAll('#sizesContainer li button span');
      const price = document.querySelector('.product-features-prices [data-testid="currentPrice"] .text-title-xl');
      const name = document.querySelector('.product-features .product-name');
      const sku = document.querySelector('.product-reference');

      product.push(offers, price, name, sku)

      return product;
        
    }, bodyHandle);

  
    browser.close();
    return JSON.stringify(data);
  
  }
  
  export default scraping;