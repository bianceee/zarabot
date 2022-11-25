import {Page} from 'puppeteer';
import {Brand} from "../../entities/brand";

export default async function (brand: Brand) {

  async function scrap(page: Page) {
    console.log(brand, page)
  }

  return {scrap}
}
