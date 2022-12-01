import {v4 as uuidv4} from 'uuid'
import Supabase from "../helpers/Supabase";

export interface Brand {
  id: number
  created_at?: string
  name: string,
}

export default function () {
  async function resolveBrandByName(name: string): Promise<Brand | null> {
    const {data, error} = await Supabase()
      .from('brands')
      .select()
      .eq('name', name)

    if (error) throw error.message

    return data ? data[0] : null
  }

  async function createBrand(name: string): Promise<Brand> {
    const {data, error} = await Supabase()
      .from('brands')
      .insert({name, id: uuidv4()})
      .select()

    if (error) throw error.message

    return data[0]
  }

  async function findOrCreateBrand(name: string) {
    const brand = await resolveBrandByName(name)

    return brand ? brand : await createBrand(name)
  }

  return {findOrCreateBrand}
}
