import {Page} from 'puppeteer';
import product, {Size} from "../../entities/product";
import {Brand} from "../../entities/brand";
import {v4 as uuidv4} from 'uuid'

export default function (brand: Brand) {

  async function scrap(page: Page): Promise<void> {
    const id = uuidv4()

    const {sku, name, price, category, sizes, img} = await page.evaluate(() => {
      function resolveSku() {
        const selector = document.querySelector(".sku-pos") as HTMLElement
        return selector.innerText
      }

      function resolveName(): string {
        const selector = document.querySelector(".product-view-title") as HTMLElement
        return selector.innerText
      }

      function resolveImg(): string {
        return document.querySelector('.img-responsive')?.getAttribute('src') ?? ''
      }

      function resolvePrice(): number {
        let price

        if (!document.querySelector("#product-right .regular-price .price")) {
          const selector = document.querySelector(".price-container.new .price .price") as HTMLElement
          price = selector.innerHTML;
        } else {
          const selector = document.querySelector("#product-right .regular-price .price") as HTMLElement
          price = selector.innerHTML;
        }

        return parseFloat(price.split(' €')[0].replace(',', '.'))
      }

      function resolveCategory(): string {
        const selector = document.querySelector(".breadcrumb li:nth-child(2) a") as HTMLElement
        return selector?.dataset?.catname?.toLowerCase() ?? 'n/a'
      }

      function resolveSize(): Partial<Size>[] {
        const sizes: Partial<Size>[] = []
        let elements = document.querySelectorAll(".size-options .selproduct-size-ect .product-size-select") as unknown as HTMLElement[]

        elements.forEach((element: HTMLElement) => {
          sizes.push({
            size: element.innerText,
            availability: element.classList.contains("size-is-out-of-stock"),
          })
        })
        return sizes
      }

      return {
        sku: resolveSku(),
        name: resolveName(),
        price: resolvePrice(),
        category: resolveCategory(),
        sizes: resolveSize(),
        img: resolveImg(),
      }
    }, await page.$('body'));

    if (await product(brand.id).getProductBySku(sku))
      throw "Produit déjà existant"

    await product(brand.id).createProduct({
      id,
      sku,
      name,
      img,
      brand_id: brand.id,
      category,
      sizes: sizes.map((size) => ({
        id: uuidv4(),
        size: size.size ?? 'n/a',
        availability: size.availability ?? false,
        product_id: id
      })),
      price,
    })
  }


  return {scrap};
}
