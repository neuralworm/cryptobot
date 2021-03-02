import {EmbedField, MessageEmbed} from 'discord.js'
const comma = require('comma-number')
export default class Ranking {
    prices: any
    constructor(prices: any){
        this.prices = prices
    }

    returnField(index: number, prices: any): EmbedField[] {
      return [
        {
          name: `${index + 1}. ${prices.data[index].name} (${prices.data[index].symbol
            })`,
          value: `$${comma(prices.data[index].quote.USD.price.toFixed(2))}`,
          inline: true,
        },
  
        {
          name: "Market Cap (USD)",
          value: `$${comma(prices.data[index].quote.USD.market_cap.toFixed(2))}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: false
        },
      ]
    }
  
    returnFields(number: number = 5): EmbedField[] {
      let fields: EmbedField[] = []
      for (let i = 0; i < number; i++) {
        // fields.push(this.returnField(i))
        fields = [...fields, ...this.returnField(i, this.prices)]
      }
      return fields
    }
  
    returnEmbedObject(): MessageEmbed {
      // @ts-ignore
      return {
        color: 0x2ecc71,
        title: "Top Crypos By Market Cap",
        // url: 'https://discord.js.org',
        // author: {
        //     name: 'CryptoBot',
        //     icon_url: 'https://i.imgur.com/wSTFkRM.png',
        //     url: 'https://discord.js.org',
        // },
        // description: `@${username}`,
        // thumbnail: {
        //     url: 'https://i.imgur.com/wSTFkRM.png',
        // },
        fields: this.returnFields(),
        // image: {
        // 	url: 'https://i.imgur.com/wSTFkRM.png',
        // },
        timestamp: new Date().getMilliseconds(),
        footer: {
          text: "Brought to you by CryptoBot",
          // icon_url: 'https://i.imgur.com/wSTFkRM.png',
        },
      }
    }
  
    getObject(): MessageEmbed {
      return this.returnEmbedObject()
    }
  }
  
  