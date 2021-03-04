import { Client, EmbedField, Message, MessageEmbed } from "discord.js"

const Discord = require("discord.js")
const cron = require("node-cron")
const fetcher = require("node-fetch")
const config = require("./config.json")
const red = require("redis").createClient()
const comma = require("comma-number")
const moment = require('moment')
const ordinal = require('ordinal')
import Field from './models/Field'
import Ticker from './models/Ticker'
import Help from './models/Help'
import Ranking from './models/Ranking'
require("dotenv").config()

const API_KEY_NOMICS: string = process.env.API_TOKEN_NOMICS!
const API_KEY_CMC: string = process.env.API_TOKEN_CMC!

// const {spawn} = require('child-process')
const prefix = "cryptobot"
// get icon server running

let prices: any = {}
let meta: any = [];
// set meta data on server start
const get_meta = async () => {
  try {
    let slug_list = get_slug_list()
    let res = await fetcher(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?slug=${slug_list}`, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY_CMC
      }
    })
    console.log(res.status)
    if (res.ok) {
      let json = await res.json()
      return json
    }
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

function get_slug_list() {
  let list = ""
  prices.data.forEach((obj: any, index: number) => {
    // if(index > 0) return
    list += `${obj.slug},`
  })
  list = list.slice(0, -1)
  return list
}

// setup redis
red.on("error", (err: Error) => {
  console.log(err)
})
red.on("ready", () => {
  // get cached crypto rankings
  red.get("crypto_latest", (err: Error, reply: string) => {
    console.log("Checking redis for Prices Object")
    if (err) {
      console.log(err)
      return
    }
    if (reply) {
      prices = JSON.parse(reply)
      console.log('CryptoBot up and running with latest prices from ' + moment(prices.status.timestamp).format('MMMM Do YYYY, h:mm:ss a'))
      // console.log(reply)
    }
  })
  // get cached crypto meta data
  red.get('crypto_meta', async (err: Error, reply: string) => {
    let res = JSON.parse(reply)
    if (err || !res) {
      let meta = await get_meta()
      red.set('crypto_meta', JSON.stringify(meta))
      return
    }
    console.log('Coin MetaData present. Will not fetch.')
    meta = res
  })
})

const client: Client = new Discord.Client()
client.login(config.BOT_TOKEN)
let bot_id: string
client.on('ready', () => {
  bot_id = client.user?.id!
})
console.log("CryptoBot starting.")

// CRON SETUP
// cmc general list
cron.schedule("*/15 * * * *", async () => {
  console.log("Getting crypto prices - ")
  let fetch_res = await get_cmc_list()
  if (fetch_res == 200) {
    console.log("Got new prices.")
    // console.log(prices)
  }
  if (fetch_res == 500) {
    console.log("Error getting prices.")
  }
})


// API CALLS
const API_ROOT_CMC = "https://pro-api.coinmarketcap.com"
const API_ROOT_NOMICS = "https://api.nomics.com/v1"
const get_cmc_list = async (): Promise<any> => {
  let url = API_ROOT_CMC + "/v1/cryptocurrency/listings/latest?limit=500"
  console.log("using endpoint " + url)
  try {
    let res = await fetcher(url, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY_CMC
      }
    })
    if (res.ok) {
      prices = await res.json()
      // console.log(prices)
      // set into redis for persistence
      red.set("crypto_latest", JSON.stringify(prices))
    }
    return 200
  } catch (err) {
    console.log(err)
    return 500
  }
}
const get_by_token = async (token: string): Promise<any> => {
  let url = `${API_ROOT_NOMICS}/currencies/ticker?key=${API_KEY_NOMICS}&ids=${token.toUpperCase()}&interval=1d,30d&convert=USD&per-page=100&page=1`
  try {
    let res = await fetcher(url)
    if (res.ok) {
      return await res.json()
    }
    else return null
  }
  catch (err) {
    console.log(err)
  }
}

// EVENTS

client.on("message", (message: Message) => {
  let command = message.content.trim().toLowerCase()
  // commands
  if (command.startsWith(prefix)) {
    let command_list = command.split(/ +/)
    command_list.shift()
    commandParser(command_list[0], command_list, message)
    return
  }
  // bot being mentioned
  if (message.mentions.users.has(bot_id)) {
    console.log('here')
    parseBotMentions(message)
  }
})

function parseBotMentions(message: Message) {
  message.channel.send(`Hello, <@${message.author.id}>`)

}

// receive event commands
function commandParser(primary_command: string, command_list: string[], message: Message) {
  if (!primary_command) {
    message.channel.send('Invalid Command. Type **cryptobot help** for command list.')
    return
  }
  switch (primary_command) {
    case "list":
      list(command_list, message)
      break
    case "help":
      help(command_list, message)
      break
    case "commands":
      help(command_list, message)
      break
    case "compare":
      compare(command_list, message)
      break
    default:
      send_single_coin(command_list, message)
      break
  }
}
// command branches
function help(command_list: string[], message: Message) {
  message.channel.send({ embed: new Help().returnHelpObject() })

}
function list(command_list: string[], message: Message) {
  let list_slice_request = command_list[1]
  if (!list_slice_request) {
    message.channel.send(`<@${message.author.id}>\n${new Ranking(prices).getObject()}`)
    return
  }
  //  parse slice string here
  let slice: number[] = parseRange(list_slice_request)
  message.channel.send(`<@${message.author.id}>\n${new Ranking(prices, slice[0], slice[1]).getObject()}`)
  return


}
function parseRange(number_range_string: string): number[] {
  let range = number_range_string.split("-").map(string => parseInt(string))
  console.log(range)
  return range
}
function compare(command_list: string[], message: Message) {
  let coin_1 = command_list[1], coin_2 = command_list[2]
  let index_1: number = getIndex(coin_1), index_2: number = getIndex(coin_2)
  if (index_1 < 0 || index_2 < 0) {
    message.channel.send(`Invalid coin identifier.`)
    return
  }
  message.channel.send(returnCompareString(index_1, index_2))
}

async function send_single_coin(command_list: string[], message: Message) {
  let ticker = command_list[0]
  let index = getIndex(ticker)
  try {
    let numics_object = await get_by_token(ticker)
    console.log(numics_object)
    // if (!numics_object[0]) throw Error()

    // // new hotness
    // let embed = await new Ticker(index, numics_object[0], prices, meta).getObject()
    // // let body = await new Ticker(index, numics_object[0], prices, meta).render()
    // message.channel.send({embed: embed})

    // old embed version
    message.channel.send({ embed: await new Ticker(index, numics_object[0], prices, meta).getObject() })

  }
  catch (err) {
    // if (index >= 0) {
    //   message.channel.send({ embed: new Ticker(index, null, prices, meta).getObject() })
    //   return
    // }
    message.channel.send('Invalid coin identifier.')
  }


}

function returnCompareString(index_1: number, index_2: number): string {
  let string = "e"
  return string
}

function sendError(message: Message) {
  message.channel.send('Invalid Command. Type **cryptobot help** for command list.')
  return
}

function getIndex(symbol_or_name: string): number {
  let index = prices.data.map((coin: any) => coin.name.toLowerCase()).indexOf(symbol_or_name)
  if (index < 0) index = prices.data.map((coin: any) => coin.symbol.toLowerCase()).indexOf(symbol_or_name)
  return index
}

// args are optional options parameteres stacked after a hyphen, ie -dm
function parseArgs(args: string) {
  if (args.charAt(0) !== "-") return null

}

function checkEmbedLength(embed: any) {
  return JSON.stringify(embed).length
}