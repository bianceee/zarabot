import puppeteer, {Page} from "puppeteer";
import Plt from "./scrappers/plt";
import brand, {Brand} from "../entities/brand";

// Déclaration des domaines et de leur scrappers
const domains: Domains = {
  // 'shop.mango.com': async (brand: Brand, page: Page) => Mango(brand).scrap(page),
  'prettylittlething.fr': async (brand: Brand, page: Page) => Plt(brand).scrap(page),
}

// On définit la forme que doivent avoir les enregistrements des domaines
interface Domains {
  [key: string]: (brand: Brand, page: Page) => Promise<void>;
}

export default async function (url: string) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  await page.goto(url, {waitUntil: "networkidle2"});

  const domain = extractDomainFromUrl(url)

  if (!domains.hasOwnProperty(domain)) throw `Domaine "${domain}" inconnu`

  await domains[domain](await brand().findOrCreateBrand(domain), page)

  await browser.close()
}

function extractDomainFromUrl(url: string): string {
  const match = url.match(/(?<=https?:\/\/(?:www\.)?)(?!www\.).+?(?=\/)/)

  if (!match) throw "Impossible d'extraire le nom de domaine"

  return match[0]
}
