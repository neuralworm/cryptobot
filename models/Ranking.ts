import { EmbedField, MessageEmbed } from 'discord.js'
const comma = require('comma-number')
export default class Ranking {
  prices: any
  result_length: number
  constructor(prices: any, result_length: number = 5) {
    this.prices = prices
    this.result_length = result_length < 21 ? result_length : 5
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
      fields: this.returnFields(this.result_length),
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

  getObject(): any {
    return this.returnCodeBlock()
  }

  // code block formatting
  returnCodeBlock(): string {
    let table_columns = `[RNK][SYMB ][NAME      ][LAST PRICE(USD)][MARKET CAP(USD)][24h CHANGE]\n`
    let string_template = `${table_columns}`

    for (let i = 0; i < this.result_length; i++) {
      string_template += this.returnStatRow(i)
    }
    return "\`\`\`" + string_template + "\`\`\`"
  }
  returnStatBlock(string: string, length: number = 10, padding: boolean = true) {
    let substring = string.toString().substr(0, length)
    substring = padding ? substring.padStart(length, " ") : substring.padEnd(length, " ")
    return `[${substring}]`
  }
  returnStatRow(index: number): string {
    let price_object = this.prices.data[index]
    let entry_template = `${this.returnStatBlock(price_object.cmc_rank, 3)}${this.returnStatBlock(price_object.symbol.toUpperCase(), 5, false)}${this.returnStatBlock(price_object.name, 10, false)}${this.returnStatBlock(comma((price_object.quote.USD.price).toFixed(2)), 15)}${this.returnStatBlock(`${comma((price_object.quote.USD.market_cap / 1000000).toFixed(0))}M`, 15,)}${this.returnStatBlock(`${(price_object.quote.USD.percent_change_24h).toFixed(1)}%`, 10)}\n`

    return entry_template
  }

}

