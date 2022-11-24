import {v4 as uuidv4} from 'uuid'
import Supabase from "../helpers/Supabase";

let brands: any = null

export default function () {
  async function fetchBrands() {
    const {data, error} = await Supabase()
      .from('brands')
      .select()

    console.log('FETCHBRAND ', error)
    brands = data
    return data
  }

  async function resolveBrand(brand: any) {
    if (brands === null) await fetchBrands()

    return brands.find((item: any) => item.name === brand)
  }

  async function createBrand(brand: any) {
    // créé la brand en DB et la retourne
    const {data, error} = await Supabase()
      .from('brands')
      .insert({name: brand, uuid: uuidv4()})
      .select()

    console.log('CREATEBRAND ', error)
    return data ? data[0] : null
  }

  async function findOrCreateBrand(brand: any) {
    brand = await resolveBrand(brand)

    return brand ? brand : await createBrand(brand)
  }

  return {findOrCreateBrand}
}
