import puppeteer from 'puppeteer';

async function scraping(url) {
	const browser = await puppeteer.launch({headless: true});

  // const shop = 'net-a-porter';
  const shop = {"url": url};

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });


  const urlArray = [url]

  const bodyHandle = await page.$('body');

  let data = await page.evaluate((body) => {
    const sizeAvailables = [];

    // if(url.includes(shop)) {
      const offers = document.querySelectorAll("ul.GridSelect11 li");
      // return body.innerHTML;

      [...offers].forEach((offer) => {
        const size = offer.querySelector("label").innerText;
        const availability =
          offer.querySelector("link").href.indexOf("InStock") !== -1;

        sizeAvailables.push({
          size,
          availability
        });
      });

      return sizeAvailables;
    // }

    
    // return {
    //   width: document.documentElement.clientWidth,
    //   height: document.documentElement.clientHeight,
    //   deviceScaleFactor: window.devicePixelRatio,
    // };
  }, bodyHandle);

  console.log('DATA ', data);
  browser.close();
  return JSON.stringify(data);

}

export default scraping;