import express from 'express'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import scrap from "./scrapping/scrap";

dotenv.config()

const app = express()
const PORT = 3000

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post('/scraping', async (req, res) => {
  console.log('Parsing : ' + req.body.uri)
  await scrap(req.body.uri)

  res.json()
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
