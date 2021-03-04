import Field from './Field'
import moment from 'moment'
const comma = require("comma-number")
import ordinal from 'ordinal'
import Grid from './Grid'
const chart = require('asciichart')
const fetcher = require('node-fetch')
const request = require('request-promise')
require('dotenv').config()
export default class Ticker {
    tickerIndex: number
    coin_object: any
    meta_data: any
    prices: any
    grid: Grid
    ohlc_url: string
    ohlc_data: Candle[]
    coin_token: string
    days: number
    constructor(tickerIndex: number = 0, numics_object: any = {}, prices: any, meta_data: any, days: number = 7) {
      this.tickerIndex = tickerIndex
      this.coin_object = numics_object
      this.prices = prices
      this.meta_data = meta_data
      this.grid = new Grid()
      this.coin_token = numics_object.id
      this.days = days
      this.ohlc_url = `https://api.coingecko.com/api/v3/coins/${prices.data[tickerIndex].slug}/ohlc?vs_currency=usd&days=${this.days}`
      this.ohlc_data = []
      this.getOHLC()
    }
    async getOHLC(): Promise<Candle[]>{
      console.log(this.ohlc_url)
      try{
        let id = this.coin_object.id
        // let res = await fetcher(this.spark_lines_url)
        let res = await fetcher(this.ohlc_url)
        console.log(res.status)
        if(res.status == 200){
         let json = await res.json()
         return json.map((obj: any)=> new Candle(obj[0], obj[1], obj[2], obj[3], obj[4]))
        }
        return []
      }
      catch(err){
        console.log(err)
        return []
      }
     
    }
    returnPrice(index: number): any {
      return {
        value: `Last Price (Updated ${moment(this.prices.data[index].quote.USD.last_updated).fromNow()})`,
        name: `$${comma(this.prices.data[index].quote.USD.price.toFixed(2))} (${this.prices.data[index].quote.USD.percent_change_24h.toFixed(1)}%)`,
        inline: true,
      }
    }
    returnMarketCap(index: number): Field {
      return {
        value: "Market Cap (USD)",
        name: `$${comma(this.prices.data[index].quote.USD.market_cap.toFixed(2))} (${ordinal(this.prices.data[index].cmc_rank)})`,
        inline: true,
      }
    }
    returnVolume(index: number): Field {
      return {
        value: "Volume (24h)",
        name: `$${comma(this.prices.data[index].quote.USD.volume_24h.toFixed(0))}`,
        inline: true,
      }
    }
    returnSupply(index: number): Field {
      return {
        value: `Supply (${this.prices.data[index].symbol})`,
        name: `${comma(this.prices.data[index].total_supply)}`,
        inline: true
  
      }
    }
    returnSpacer(): Field {
      return {
        name: '\u200B',
        value: '\u200B',
        inline: false
      }
    }
    returnField(name: string, value: string, inline: boolean = false): Field{
      return{
        name: name,
        value: value,
        inline: inline
      }
    }
    returnMetaData(index: number): Field[]{
      let field_array: Field[] = []
      if(this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.website){
        field_array.push(this.returnField("Website", this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.website))
      }
      if(this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.technical_doc[0]){
        field_array.push(this.returnField('White Paper', this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.technical_doc[0]))
      }
      if(this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.explorer[0]){
        field_array.push(this.returnField('Blockchain Viewer', this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.explorer[0]))
      }
      if(this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.source_code[0]){
        field_array.push(this.returnField('Source Code', this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.source_code[0]))
      }
   
      return field_array
    }
    async returnEmbedObject(): Promise<any> {
      return {
        color: 0x2ecc71,
        title: `${this.prices.data[this.tickerIndex].name} (${this.prices.data[this.tickerIndex].symbol
          })`,
        url: `https://coinmarketcap.com/currencies/${this.prices.data[this.tickerIndex].slug
          }/`,
        thumbnail: {
          url: this.meta_data.data[this.prices.data[this.tickerIndex].id].logo,
        },
        fields: [
          this.returnPrice(this.tickerIndex),
          this.returnMarketCap(this.tickerIndex),
          // this.returnSpacer(),
          this.returnVolume(this.tickerIndex),
          this.returnSupply(this.tickerIndex),
          ...this.returnMetaData(this.tickerIndex)
         
        ],
        timestamp: new Date(),
        footer: {
          text: "Brought to you by CryptoBot",
        },
      }
    }
    returnTickerLayout(): string{
      let template = ``
      return template
    }
    
    // async createChart(): Promise<string[][]>{
    //   let grid: string[][] = [['']]
    //   await this.getOHLC()
    //   let object = this.ohlc_data[0]
    //   // create grid section from spark_lines
    //   let points: Point[] = object.timestamps.map((timestampString: string, index: number)=>{
    //     return new Point(timestampString, object.prices[index])
    //   })
      
    //   console.log(chart.plot(points.map(pnt=>pnt.price)))

    //   return grid
    // }
    async render(): Promise<string>{
      // get spark lines
      // let chart = await this.createChart()
      let rendered_string = ''
      
      this.grid.coordinates.forEach((array, array_index)=>{
        array.forEach((cell_value, cell_index)=>{
          rendered_string += `${cell_value}`
        })
        rendered_string += '\n'
      })
      return `\`\`\`${rendered_string}\`\`\``
    }
    async getObject() {
      return await this.returnEmbedObject()
    }
  }
  class Point{
    date: Date
    price: number
    constructor(date_string: string, price_string: string){
      this.date = new Date(Date.parse(date_string))
      this.price = this.autoscale(parseFloat(price_string))
    }
    autoscale(number: number):number{
      let price = number
      if(price > 1000) price = price / 1000
      return price
    }
  }
  class Candle{
    date: Date
    open: number
    high: number
    low: number
    close: number
    constructor(date: number, open: number, high: number, low: number, close: number){
      this.date = new Date(date)
      this.open = open
      this.high = high
      this.low = low
      this.close = close
    }
  }