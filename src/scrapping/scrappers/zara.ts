import { Brand } from "../../entities/brand";
// import { default as newProduct } from "../../entities/product";
// import {v4 as uuidv4} from 'uuid'


export default function (brand: Brand) {

  async function scrap(url: string) {
    console.log(brand)
    const data = await fetch(url)
    const response = await data.text();
    const zaraData = response.match(/"product":(\{.*\}),"showNativeAppBanner/gm);
    const productData = zaraData ? JSON.parse(zaraData[1]):null;
    console.log(productData);
    // const product = productData.ecommerce.detail.products[0];
    
    // const availableSizes = product.sizeAvailability.split(',');
    // const unavailableSizes = product.sizeNoAvailability.split(',');

    // if (await newProduct(brand.id).getProductBySku(product.id))
    //   throw "Produit déjà existant"
     
    // await newProduct(brand.id).createProduct({
    //   sku: product.id,
    //   name: product.simpleName,
    //   price: product.price,
    //   category: product.category,
    //   sizes: availableSizes.concat(unavailableSizes).map((size: string) => {
    //     return {
    //       id: uuidv4(),
    //       size,
    //       availability: availableSizes.includes(size),
    //       product_id: product.id
    //     }
    //   }),
    //   img: product.photos.outfit,
    //   brand_id: brand.id
    // })
  }

  return {scrap}
}
