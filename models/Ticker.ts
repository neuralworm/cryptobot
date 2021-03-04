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
    spark_lines_url: string
    spark_lines: any
    coin_token: string
    start_date: Date
    end_date: Date

    constructor(tickerIndex: number = 0, numics_object: any = {}, prices: any, meta_data: any) {
      this.tickerIndex = tickerIndex
      this.coin_object = numics_object
      this.prices = prices
      this.meta_data = meta_data
      this.grid = new Grid()
      this.coin_token = numics_object.id
      this.end_date = new Date()
      this.start_date = new Date(Date.now() - (1000*60*60*24*7))
      this.spark_lines_url = `https://api.nomics.com/v1/currencies/sparkline?key=${process.env.API_TOKEN_NOMICS}&ids=${this.coin_token}&start=${this.start_date.toISOString()}&end=${this.end_date.toISOString()}`
    }
    async getSparklines(){
      console.log(this.spark_lines_url)
      try{
        let id = this.coin_object.id
        // let res = await fetcher(this.spark_lines_url)
        let res = await request({
          uri: this.spark_lines_url,
          json: true
        })
        console.log(res)
        
      }
      catch(err){
        console.log(err)
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
          // this.returnField(`Past ${(this.end_date.getTime() - this.start_date.getTime()) / (1000*60*60*24)} Days`, await this.render())
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
    
    async createChart(): Promise<string[][]>{
      let grid: string[][] = [['']]
      await this.getSparklines()
      let object = this.spark_lines[0]
      // create grid section from spark_lines
      let points: Point[] = object.timestamps.map((timestampString: string, index: number)=>{
        return new Point(timestampString, object.prices[index])
      })
      
      console.log(chart.plot(points.map(pnt=>pnt.price)))

      return grid
    }
    async render(): Promise<string>{
      // get spark lines
      let chart = await this.createChart()
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