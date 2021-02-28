const Discord = require("discord.js")
const cron = require("node-cron")
const fetch = require("node-fetch")
const config = require("./config.json")
const red = require("redis").createClient()
const comma = require("comma-number")
const moment = require('moment')
const ordinal = require('ordinal')
require("dotenv").config()

let prices = {}

// setup redis
red.on("error", (err) => {
  console.log(err)
})
red.on("ready", () => {
  red.get("crypto_latest", (err, reply) => {
    console.log("getting from redis")
    if (err) {
      console.log(err)
      return
    }
    if (reply) {
      prices = JSON.parse(reply)
      console.log(prices.status)
      // console.log(reply)
    }
  })
})

const client = new Discord.Client()
client.login(config.BOT_TOKEN)
const API_KEY = process.env.API_TOKEN
// console.log(API_KEY)

console.log("CryptoBot running.")

// CRON SETUP
cron.schedule("*/5 * * * *", async () => {
  console.log("Getting crypto prices - ")
  let fetch_res = await get_prices()
  if (fetch_res == 200) {
    console.log("Got new prices.")
    console.log(prices)
  }
  if (fetch_res == 500) {
    console.log("Error getting prices.")
  }
})

// API CALLS
const API_ROOT = "https://pro-api.coinmarketcap.com"
const get_prices = async () => {
  let url = API_ROOT + "/v1/cryptocurrency/listings/latest?limit=500"
  console.log("using endpoint " + url)
  try {
    console.log(API_KEY)
    let res = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
      },
    })
    console.log(res.status)
    if (res.status == 200) {
      prices = await res.json()
      console.log(prices)
      // set into redis for persistence
      red.set("crypto_latest", JSON.stringify(prices))
    }
    return 200
  } catch (err) {
    console.log(err)
    return 500
  }
}

// EVENTS

// client.on("guildMemberAdd", (member) => {
//     let channel = member.guild.channels.cache.find(ch => ch.name)
//     channel.send(`Welcome to ${channel}, ${member}.`)
// })
client.on("message", (message) => {
  let user = message.author.username
  let command = message.content

  console.log(command)
  if (command.startsWith("cryptobot")) {
    let command_list = command.split(" ")
    console.log(command_list)
    // if list command contains a number
    if (command_list[1] == "list" && command_list[2]) {
      if (
        !isNaN(command_list[2]) &&
        command_list[2] > 0 &&
        command_list[2] < 8
      ) {
        message.channel.send({
          embed: new EmbedObject(command_list[2]).getObject(),
        })
      }
    }
    // individual symbol commands
    if (command_list[1] && command_list[1] !== "list") {
      let ticker = command_list[1].toLowerCase()
      console.log(ticker)
      let ticker_array = prices.data.map(
        (coinObject) => coinObject.symbol.toLowerCase()
      )
      let index = ticker_array.indexOf(ticker)
      console.log(index)
      if (index == -1) message.channel.send("Invalid Crypto Ticker")
      else message.channel.send({ embed: new Ticker(index).getObject() })
    }

    // else print default top five
    else message.channel.send({ embed: new EmbedObject().getObject() })
  }
})

// EMBED OBJECT CONSTRUCTORS
class Ticker {
  constructor(tickerIndex = 0) {
    this.tickerIndex = tickerIndex
  }
  returnPrice(index) {
    return {
      name: `Last Price (Updated ${moment(prices.data[index].quote.USD.last_updated).fromNow()})`,
      value: `$${comma(prices.data[index].quote.USD.price.toFixed(2))} (${prices.data[index].quote.USD.percent_change_24h.toFixed(1)}%)`,
      inline: true,
    }
  }
  returnMarketCap(index) {
    return {
      name: "Market Cap (USD)",
      value: `$${comma(prices.data[index].quote.USD.market_cap.toFixed(2))} (${ordinal(prices.data[index].cmc_rank)})`,
      inline: true,
    }
  }
  returnVolume(index) {
    return {
      name: "Volume (24h)",
      value: `$${comma(prices.data[index].quote.USD.volume_24h.toFixed(0))}`,
      inline: true,
    }
  }
  returnSupply(index){
      return{
          name: `Supply (${prices.data[index].symbol}`,
          value: `${comma(prices.data[index].total_supply)}`,
          inline: true

      }
  }
  returnSpacer(){
      return{
        name: '\u200B',
        value: '\u200B',
      }
  }
  returnEmbedObject() {
    return {
      color: 0x2ecc71,
      title: `${prices.data[this.tickerIndex].name} (${
        prices.data[this.tickerIndex].symbol
      })`,
      url: `https://coinmarketcap.com/currencies/${
        prices.data[this.tickerIndex].slug
      }/`,
      // author: {
      //     name: 'CryptoBot',
      //     icon_url: 'https://i.imgur.com/wSTFkRM.png',
      //     url: 'https://discord.js.org',
      // },
      // description: 'Top Cryptos',
      // thumbnail: {
      //     url: 'https://i.imgur.com/wSTFkRM.png',
      // },
      fields: [
          this.returnPrice(this.tickerIndex),
          this.returnMarketCap(this.tickerIndex),
          this.returnSpacer(),
          this.returnVolume(this.tickerIndex),
          this.returnSupply(this.tickerIndex),
          this.returnSpacer()


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

class EmbedObject {
  constructor(number = 5) {
    this.number = number
  }

  returnField(index) {
    return [
      {
        name: `${index + 1}. ${prices.data[index].name} (${
          prices.data[index].symbol
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
      },
    ]
  }

  returnFields(number) {
    let fields = []
    for (let i = 0; i < number; i++) {
      fields.push(this.returnField(i))
    }
    return fields
  }

  returnEmbedObject() {
    return {
      color: 0x2ecc71,
      title: "Top Crypos By Market Cap",
      // url: 'https://discord.js.org',
      // author: {
      //     name: 'CryptoBot',
      //     icon_url: 'https://i.imgur.com/wSTFkRM.png',
      //     url: 'https://discord.js.org',
      // },
      // description: 'Top Cryptos',
      // thumbnail: {
      //     url: 'https://i.imgur.com/wSTFkRM.png',
      // },
      fields: this.returnFields(this.number),
      // image: {
      // 	url: 'https://i.imgur.com/wSTFkRM.png',
      // },
      timestamp: new Date(),
      footer: {
        text: "Brought to you by CryptoBot",
        // icon_url: 'https://i.imgur.com/wSTFkRM.png',
      },
    }
  }

  getObject() {
    return this.returnEmbedObject()
  }
}
