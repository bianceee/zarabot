import puppeteer from 'puppeteer';

export default async function (url: string) {
  // const browser = await puppeteer.launch({headless: false, slowMo: 250, devtools: true }); // Pour debugger
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  await page.goto(url, {waitUntil: "networkidle2"});


  const bodyHandle = await page.$('body');

  let data = await page.evaluate((body) => {
    if (!body) return

    const product: [] = [];
    const offers = body.querySelectorAll('#sizesContainer li ')

    console.log(product, offers)
  }, bodyHandle);


  await browser.close();
  return JSON.stringify(data);
}
