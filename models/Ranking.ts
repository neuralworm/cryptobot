import { EmbedField, MessageEmbed } from 'discord.js'
const comma = require('comma-number')
export default class Ranking {
  prices: any
  slice_start: number
  slice_end: number
  constructor(prices: any, slice_start: number = 1, slice_end: number = 25) {
    this.prices = prices
    this.slice_start = slice_start
    this.slice_end = slice_end - slice_start < 25 ? slice_end : slice_start + 25
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

  returnFields(slice_start: number, slice_end: number): EmbedField[] {
    let fields: EmbedField[] = []
    for (let i = slice_start - 1; i < slice_end ; i++) {
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
      fields: this.returnFields(this.slice_start, this.slice_end),
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
    let table_columns = `[RNK][SYMB ][NAME        ][PRICE  (USD)][CAP  (USD)][    24H][     7D]\n`
    let string_template = `${table_columns}`

    for (let i = this.slice_start - 1; i < this.slice_end; i++) {
      string_template += this.returnStatRow(i)
    }
    console.log(string_template.length)
    return "\`\`\`" + string_template + "\`\`\`"
  }
  returnStatBlock(string: string, length: number = 10, padding: boolean = true) {
    let substring = string.toString().substr(0, length)
    substring = padding ? substring.padStart(length, " ") : substring.padEnd(length, " ")
    return `[${substring}]`
  }
  returnStatRow(index: number): string {
    let price_object = this.prices.data[index]
    let entry_template = `${this.returnStatBlock(price_object.cmc_rank, 3)}${this.returnStatBlock(price_object.symbol.toUpperCase(), 5, false)}${this.returnStatBlock(price_object.name, 12, false)}${this.returnStatBlock(comma((price_object.quote.USD.price).toFixed(2)), 12)}${this.returnStatBlock(`${comma((price_object.quote.USD.market_cap / 1000000).toFixed(0))}M`, 10,)}${this.returnStatBlock(`${(price_object.quote.USD.percent_change_24h).toFixed(1)}%`, 7)}${this.returnStatBlock(`${(price_object.quote.USD.percent_change_7d).toFixed(1)}%`, 7)}\n`
    return entry_template
  }

}

