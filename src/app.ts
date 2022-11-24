import express from 'express'
import bodyParser from 'body-parser'
import {createClient} from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import Brand from './entities/Brand'
import Product from './entities/Product'
import Plt from './parsers/Plt'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
if (!supabaseUrl) throw 'Supabase URL shouldnt be empty'
if (!supabaseKey) throw 'Supabase KEY shouldnt be empty'
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express()
const PORT = 3000

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// app.post('/scraping', async (req, res) => {
//     const data = await scraping('https://www.net-a-porter.com/fr-fr/shop/product/gianvito-rossi/chaussures/bottes/bottes-en-daim-hansen-70/38063312420989875');
//     console.log(data);
//     res.json(data)
// })

app.post('/scraping', async (req, res) => {
  const uri = req.body.uri
  const info = await Plt(uri)
  const dataParsed = JSON.parse(info)

  const regex = /(?<=https?:\/\/(?:www\.)?)(?!www\.).+?(?=\/)/
  const brand = uri.match(regex)[0]
  console.log(brand)

  // Todo: add shoe size choice programatically
  // const { availability } = dataParsed?.find(element => element.size === '41');

  const newBrand = await Brand(supabase).findOrCreateBrand(brand)
  const data = await Product(supabase, newBrand.uuid).findOrCreateProduct(dataParsed)

  res.json(data)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
