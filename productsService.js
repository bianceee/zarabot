let products = null;

export default function (supabase, brandUUID) {
    async function fetchProducts() {
			const { data, error } = await supabase
			.from('products')
			.select();

			console.log('PRODUCT ERROR', error);

    	products = data;
      return products;
    }
  
    async function resolveProduct(sku) {
      if (products === null) await fetchProducts();
  
      return products.find((item) => item.sku === sku);
    }
  
    async function createProduct(dataScraped) {
  		const { name, price, sku, img, category } = dataScraped?.find(element => element.name);
			const { data, error } = await supabase
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
			console.log("PRODUCT DATA",data);

			createSizes(dataScraped,data[0].id)

			console.log('PRODUCT ERROR', error);
  
      return data[0];
    }
  
    async function findOrCreateProduct(dataScraped) {
			console.log('dataScraped ', dataScraped);
      products = await resolveProduct(dataScraped[0].sku);
  
      return products ? products : createProduct(dataScraped);
    }

		function createSizes(dataScraped, productId) {
			const sizes = dataScraped?.filter(element => {
				if (element.size !== undefined) return element.size
				else return; 
			});

				sizes.forEach(async(size) => {
				const { data, error } = await supabase
				.from('sizes')
				.insert({ size: size.size, product_id: productId, availability: size.availability })
				.select();
				console.log("DATA SIZES ", data);
				console.log("ERROR SIZES ", error);
			});

		}
  
    return { findOrCreateProduct };
  }