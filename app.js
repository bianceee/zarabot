import express from 'express';
import scraping from './nep.js';
import bodyParser from 'body-parser'
import plt from './plt.js';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import brandService from './brandService.js';
import productService from './productsService.js'
dotenv.config()

const supabaseUrl = 'https://zeyfmevhaplspnysldif.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3000;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// app.post('/scraping', async (req, res) => {
//     const data = await scraping('https://www.net-a-porter.com/fr-fr/shop/product/gianvito-rossi/chaussures/bottes/bottes-en-daim-hansen-70/38063312420989875');
//     console.log(data);
//     res.json(data)
// })

app.post('/scraping', async (req, res) => {
  const uri = req.body.uri;
  const info = await plt(uri);
  const dataParsed = JSON.parse(info);

  const regex = /(?<=https?:\/\/(?:www\.)?)(?!www\.).+?(?=\/)/;
  const brand = uri.match(regex)[0];
  console.log(brand);


  // Todo: add shoe size choice programatically
  // const { availability } = dataParsed?.find(element => element.size === '41');

 
  const newBrand = await brandService(supabase).findOrCreateBrand(brand);
  const data = await productService(supabase, newBrand.uuid).findOrCreateProduct(dataParsed);
  

  res.json(data)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
  