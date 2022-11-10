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

      const offers = document.querySelectorAll(".size-options .selproduct-size-ect .product-size-select");
      const name = document.querySelector(".product-view-title").innerText;
      

      let basePrice;

      // if there's no regular price then the base price is gonna be the new discounted price
      if(!document.querySelector("#product-right .regular-price .price")) {
        basePrice = document.querySelector(".price-container.new .price .price").innerHTML;
      } else {
        basePrice =  document.querySelector("#product-right .regular-price .price").innerHTML;
      }

      const priceSplitted = basePrice.split(' €')[0];
      const priceReplaced = priceSplitted.replace(',','.');
      const price = parseFloat(priceReplaced);

      const sku = document.querySelector(".sku-pos").innerText;

      const img = document.querySelector('.img-responsive').getAttribute('src');

      const catName = document.querySelector(".breadcrumb li:nth-child(2) a").dataset.catname;
      const category = catName.toLowerCase();

      // get all sizes
      if(category !== "accessories") {
        [...offers].forEach((offer) => {
          const size = offer.innerText;
          const availability = offer.classList.contains("size-is-out-of-stock");

          product.push({
            size,
            availability: !availability
          });
        });
      }

      product.push({
        name,
        price,
        sku,
        img,
        category,
      });

      return product;
  }, bodyHandle);

  data.forEach((offer) => {
    console.table(offer)
    console.log(`Taille ${offer.size} : ${offer.availability}`);
  });

  browser.close();
  return JSON.stringify(data);

}

export default scraping;