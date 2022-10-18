import puppeteer from 'puppeteer';

async function scraping(url) {
    const browser = await puppeteer.launch({headless: true});

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  await page.goto(url, { waitUntil: "networkidle2" });


  const bodyHandle = await page.$('body');

  let data = await page.evaluate((body) => {
    const sizeAvailables = [];

      const offers = document.querySelectorAll(".size-options .selproduct-size-ect .product-size-select");
      const name = document.querySelector(".product-view-title").innerText;
      const priceText = document.querySelector(".price-container.new .price .price").innerText;
      const priceSplitted = priceText.split(' €')[0];
      const priceReplaced = priceSplitted.replace(',','.');
      const price = parseFloat(priceReplaced);


      [...offers].forEach((offer) => {
        const size = offer.innerText;
        const availability = offer.classList.contains("size-is-out-of-stock");

        sizeAvailables.push({
          size,
          availability: !availability
        });
      });
      sizeAvailables.push({
        name,
        price
      });

      return sizeAvailables;
  }, bodyHandle);

  // data.forEach((offer) => {
  //   // console.table(offer)
  //   console.log(`Taille ${offer.size} : ${offer.availability}`);
  // });

  browser.close();
  return JSON.stringify(data);

}

export default scraping;