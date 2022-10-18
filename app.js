import express from 'express';
import scraping from './nep.js';
import plt from './plt.js';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config()

const supabaseUrl = 'https://zeyfmevhaplspnysldif.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3000;


app.post('/scraping', async (req, res) => {
    const data = await scraping('https://www.net-a-porter.com/fr-fr/shop/product/gianvito-rossi/chaussures/bottes/bottes-en-daim-hansen-70/38063312420989875');
    console.log(data);
    res.json(data)
})

app.get('/scraping/:uri', async (req, res) => {
  const uri = req.params.uri;
  const encoded = encodeURI(uri);
  console.log(encoded);
  console.log(uri);
  const info = await plt(encoded);
  const dataParsed = JSON.parse(info);

  const { name, price } = dataParsed?.find(element => element.name);

  const { data, error } = await supabase
  .from('product')
  .insert({ name, price })
  .select();


  console.log(data);

  console.log(error);

  res.json(data)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
  