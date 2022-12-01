import Supabase from "../helpers/Supabase";

export interface Product {
  id?: string
  created_at?: string
  name: string
  price: number
  sku: string
  img: string
  category: string
  brand_id: number
  sizes: Size[]
}

export interface Size {
  id: string
  size: string
  product_id: string
  created_at?: string
  availability: boolean
}

export default function (brandUUID: number) {
  async function getProductBySku(sku: string): Promise<Product | null> {
    const {data, error} = await Supabase()
      .from('products')
      .select()
      .eq('sku', sku)
      .eq('brand_id', brandUUID);

    console.log('resolveProduct Error', error)

    return data ? data[0] as Product : null;
  }

  async function createProduct(product: Product): Promise<Product> {
    const {data, error} = await Supabase()
      .from('products')
      .insert({
        name: product.name,
        price: product.price,
        sku: product.sku,
        img: product.img,
        category: product.category,
        brand_id: product.brand_id,
      })
      .select();

    if (error) {
      throw error.message
    }

    createSizes(product.sizes, data[0].id)

    return data[0];
  }

  function createSizes(sizes: Size[], productId: string) {
    sizes.forEach(async (size: Size) => {
      const {error} = await Supabase()
        .from('sizes')
        .insert({size: size.size, product_id: productId, availability: size.availability});

      if (error) throw error.message
    });
  }

  return {createProduct, getProductBySku};
}
