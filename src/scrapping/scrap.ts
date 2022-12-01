import puppeteer, { Page, Browser} from "puppeteer";
import Plt from "./scrappers/plt";
import Mango from "./scrappers/mango";
import Zara from "./scrappers/zara";
import brand, {Brand} from "../entities/brand";

// Déclaration des domaines et de leur scrappers
const domains: Domains = {
  'shop.mango.com': async (brand: Brand, url: string) => await Mango(brand).scrap(url),
  'prettylittlething.fr': async (brand: Brand, url: string) => await Plt(brand).scrap(url),
  'zara.com': async (brand: Brand, url: string) => await Zara(brand).scrap(url),
}

// On définit la forme que doivent avoir les enregistrements des domaines
interface Domains {
  [key: string]: (brand: Brand, url: string) => Promise<void>;
}

interface InitPuppeteer {
  browser: Browser
  page: Page
}


export async function initPuppeteer(url: string):Promise<InitPuppeteer> {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  await page.goto(url, {waitUntil: "networkidle2"});

  return {browser, page};
}

export async function closePuppeteer(browser: Browser) {
  await browser.close()
}

export default async function (url: string) {
  const domain = extractDomainFromUrl(url)

  if (!domains.hasOwnProperty(domain)) throw `Domaine "${domain}" inconnu`

  await domains[domain](await brand().findOrCreateBrand(domain), url)

}

function extractDomainFromUrl(url: string): string {
  const match = url.match(/(?<=https?:\/\/(?:www\.)?)(?!www\.).+?(?=\/)/)

  if (!match) throw "Impossible d'extraire le nom de domaine"

  return match[0]
}
