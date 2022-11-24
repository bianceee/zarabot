import Supabase from "../helpers/Supabase";

let products: any = null;

export default function (brandUUID: string) {
  async function fetchProducts() {
    const {data, error} = await Supabase()
      .from('products')
      .select();

    console.log('PRODUCT ERROR', error);

    return data;
  }

  async function resolveProduct(sku: string) {
    if (products === null) await fetchProducts();

    return products.find((item: any) => item.sku === sku);
  }

  async function createProduct(dataScraped: any) {
    const {name, price, sku, img, category} = dataScraped?.find((element: any) => element.name);
    const {data, error} = await Supabase()
      .from('products')
      .insert({
        name,
        price,
        availability: false,
        sku,
        img,
        category,
        brand_id: brandUUID
      })
      .select();

    console.log("PRODUCT DATA", data);
    console.log('PRODUCT ERROR', error);

    if (data) {
      createSizes(dataScraped, data[0].id)

      return data[0];
    }
  }

  async function findOrCreateProduct(dataScraped: any) {
    console.log('dataScraped ', dataScraped);
    products = await resolveProduct(dataScraped[0].sku);

    return products ? products : createProduct(dataScraped);
  }

  function createSizes(dataScraped: any, productId: any) {
    const sizes = dataScraped?.filter((element: any) => {
      if (element.size !== undefined) return element.size
      else return;
    });

    sizes.forEach(async (size: any) => {
      const {data, error} = await Supabase()
        .from('sizes')
        .insert({size: size.size, product_id: productId, availability: size.availability})
        .select();
      console.log("DATA SIZES ", data);
      console.log("ERROR SIZES ", error);
    });

  }

  return {findOrCreateProduct};
}
