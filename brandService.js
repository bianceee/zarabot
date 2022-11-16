
import { v4 as uuidv4 } from 'uuid';

let brands = null;

export default function (supabase) {
  async function fetchBrands() {
    const { data, error } = await supabase
    .from('brands')
    .select();

    console.log(error);
    brands = data;
    return data;
  }

  async function resolveBrand(brand) {
    if (brands === null) await fetchBrands();

    // check si ca existe dans brands

    return brands.find((item) => item.name === brand);
  }

  async function createBrand(brand) {
    // créé la brand en DB et la retourne
    const { data, error } = await supabase
    .from('brands')
    .insert({ name: brand, uuid: uuidv4() })

    console.log(error);
    console.log(data);

    return data;
  }

  function findOrCreateBrand(brand) {
    brand = resolveBrand(brand);

    return brand ? brand : createBrand();
  }

  return { findOrCreateBrand };
}