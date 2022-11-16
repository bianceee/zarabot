
import { v4 as uuidv4 } from 'uuid';

let brands = null;

export default function (supabase) {
  async function fetchBrands() {
    const { data, error } = await supabase
    .from('brands')
    .select();

    console.log("FETCHBRAND ", error);
    brands = data;
    return data;
  }

  async function resolveBrand(brand) {
    if (brands === null) await fetchBrands();

    return brands.find((item) => item.name === brand);
  }

  async function createBrand(brand) {
    // créé la brand en DB et la retourne
    const { data, error } = await supabase
    .from('brands')
    .insert({ name: brand, uuid: uuidv4() })
    .select();
    
    console.log("CREATEBRAND ", error)
    return data[0];
  }

  async function findOrCreateBrand(brand) {
    brand = await resolveBrand(brand);

    return brand ? brand : await createBrand();
  }

  return { findOrCreateBrand };
}