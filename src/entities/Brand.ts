import { v4 as uuidv4 } from 'uuid'

let brands: any = null

export default function (supabase: any) {
    async function fetchBrands() {
        const { data, error } = await supabase
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
        const { data, error } = await supabase
            .from('brands')
            .insert({ name: brand, uuid: uuidv4() })
            .select()

        console.log('CREATEBRAND ', error)
        return data[0]
    }

    async function findOrCreateBrand(brand: any) {
        brand = await resolveBrand(brand)

        return brand ? brand : await createBrand(brand)
    }

    return { findOrCreateBrand }
}
