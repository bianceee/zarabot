import puppeteer from 'puppeteer';

async function scraping(url: string) {
  // const browser = await puppeteer.launch({headless: false, slowMo: 250, devtools: true }); // Pour debugger
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  await page.goto(url, {waitUntil: "networkidle2"});


  const bodyHandle = await page.$('body');

  let data = await page.evaluate(() => {
    const product = [];

    const offers = document.querySelectorAll(".size-options .selproduct-size-ect .product-size-select");
    // @ts-ignore
    const name = document.querySelector(".product-view-title").innerText;

    let basePrice;

    // if there's no regular price then the base price is gonna be the new discounted price
    if (!document.querySelector("#product-right .regular-price .price")) {
      // @ts-ignore
      basePrice = document.querySelector(".price-container.new .price .price").innerHTML;
    } else {
      // @ts-ignore
      basePrice = document.querySelector("#product-right .regular-price .price").innerHTML;
    }

    const priceSplitted = basePrice.split(' €')[0];
    const priceReplaced = priceSplitted.replace(',', '.');
    const price = parseFloat(priceReplaced);

    // @ts-ignore
    const sku = document.querySelector(".sku-pos").innerText;

    // @ts-ignore
    const img = document.querySelector('.img-responsive').getAttribute('src');

    // @ts-ignore
    const catName = document.querySelector(".breadcrumb li:nth-child(2) a").dataset.catname;
    const category = catName.toLowerCase();

    // get all sizes
    if (category !== "accessories") {
      [...offers].forEach((offer) => {
        // @ts-ignore
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

  // DEBUG
  // data.forEach((offer) => {
  //   console.table(offer)
  //   console.log(`Taille ${offer.size} : ${offer.availability}`);
  // });

  await browser.close();
  return JSON.stringify(data);

}

export default scraping;
