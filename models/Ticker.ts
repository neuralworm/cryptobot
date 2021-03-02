// import comma from 'comma-number'
import Field from './Field'
import moment from 'moment'
const comma = require("comma-number")
import ordinal from 'ordinal'
export default class Ticker {
    tickerIndex: number
    coin_object: any
    meta_data: any
    prices: any
    constructor(tickerIndex: number = 0, numics_object: any = {}, prices: any, meta_data: any) {
      this.tickerIndex = tickerIndex
      this.coin_object = numics_object
      this.prices = prices
      this.meta_data = meta_data
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
    returnEmbedObject(): any {
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
          this.returnSpacer(),
          this.returnVolume(this.tickerIndex),
          this.returnSupply(this.tickerIndex),
        ],
        timestamp: new Date(),
        footer: {
          text: "Brought to you by CryptoBot",
        },
      }
    }
    getObject() {
      return this.returnEmbedObject()
    }
  }