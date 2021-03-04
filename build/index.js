"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var cron = require("node-cron");
var fetcher = require("node-fetch");
var config = require("./config.json");
var red = require("redis").createClient();
var comma = require("comma-number");
var moment = require('moment');
var ordinal = require('ordinal');
var Ticker_1 = __importDefault(require("./models/Ticker"));
var Help_1 = __importDefault(require("./models/Help"));
var Ranking_1 = __importDefault(require("./models/Ranking"));
require("dotenv").config();
var API_KEY_NOMICS = process.env.API_TOKEN_NOMICS;
var API_KEY_CMC = process.env.API_TOKEN_CMC;
// const {spawn} = require('child-process')
var prefix = "cryptobot";
// get icon server running
var prices = {};
var meta = [];
// set meta data on server start
var get_meta = function () { return __awaiter(void 0, void 0, void 0, function () {
    var slug_list, res, json, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                slug_list = get_slug_list();
                return [4 /*yield*/, fetcher("https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?slug=" + slug_list, {
                        headers: {
                            "X-CMC_PRO_API_KEY": API_KEY_CMC
                        }
                    })];
            case 1:
                res = _a.sent();
                console.log(res.status);
                if (!res.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, res.json()];
            case 2:
                json = _a.sent();
                return [2 /*return*/, json];
            case 3: return [2 /*return*/, null];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); };
function get_slug_list() {
    var list = "";
    prices.data.forEach(function (obj, index) {
        // if(index > 0) return
        list += obj.slug + ",";
    });
    list = list.slice(0, -1);
    return list;
}
// setup redis
red.on("error", function (err) {
    console.log(err);
});
red.on("ready", function () {
    // get cached crypto rankings
    red.get("crypto_latest", function (err, reply) {
        console.log("Checking redis for Prices Object");
        if (err) {
            console.log(err);
            return;
        }
        if (reply) {
            prices = JSON.parse(reply);
            console.log('CryptoBot up and running with latest prices from ' + moment(prices.status.timestamp).format('MMMM Do YYYY, h:mm:ss a'));
            // console.log(reply)
        }
    });
    // get cached crypto meta data
    red.get('crypto_meta', function (err, reply) { return __awaiter(void 0, void 0, void 0, function () {
        var res, meta_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = JSON.parse(reply);
                    if (!(err || !res)) return [3 /*break*/, 2];
                    return [4 /*yield*/, get_meta()];
                case 1:
                    meta_1 = _a.sent();
                    red.set('crypto_meta', JSON.stringify(meta_1));
                    return [2 /*return*/];
                case 2:
                    console.log('Coin MetaData present. Will not fetch.');
                    meta = res;
                    return [2 /*return*/];
            }
        });
    }); });
});
var client = new Discord.Client();
client.login(config.BOT_TOKEN);
var bot_id;
client.on('ready', function () {
    var _a;
    bot_id = (_a = client.user) === null || _a === void 0 ? void 0 : _a.id;
});
console.log("CryptoBot starting.");
// CRON SETUP
// cmc general list
cron.schedule("*/15 * * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var fetch_res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Getting crypto prices - ");
                return [4 /*yield*/, get_cmc_list()];
            case 1:
                fetch_res = _a.sent();
                if (fetch_res == 200) {
                    console.log("Got new prices.");
                    // console.log(prices)
                }
                if (fetch_res == 500) {
                    console.log("Error getting prices.");
                }
                return [2 /*return*/];
        }
    });
}); });
// API CALLS
var API_ROOT_CMC = "https://pro-api.coinmarketcap.com";
var API_ROOT_NOMICS = "https://api.nomics.com/v1";
var get_cmc_list = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, res, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = API_ROOT_CMC + "/v1/cryptocurrency/listings/latest?limit=500";
                console.log("using endpoint " + url);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, fetcher(url, {
                        headers: {
                            "X-CMC_PRO_API_KEY": API_KEY_CMC
                        }
                    })];
            case 2:
                res = _a.sent();
                if (!res.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, res.json()
                    // console.log(prices)
                    // set into redis for persistence
                ];
            case 3:
                prices = _a.sent();
                // console.log(prices)
                // set into redis for persistence
                red.set("crypto_latest", JSON.stringify(prices));
                _a.label = 4;
            case 4: return [2 /*return*/, 200];
            case 5:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, 500];
            case 6: return [2 /*return*/];
        }
    });
}); };
var get_by_token = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var url, res, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = API_ROOT_NOMICS + "/currencies/ticker?key=" + API_KEY_NOMICS + "&ids=" + token.toUpperCase() + "&interval=1d,30d&convert=USD&per-page=100&page=1";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, fetcher(url)];
            case 2:
                res = _a.sent();
                if (!res.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, res.json()];
            case 3: return [2 /*return*/, _a.sent()];
            case 4: return [2 /*return*/, null];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// EVENTS
client.on("message", function (message) {
    var command = message.content.trim().toLowerCase();
    // commands
    if (command.startsWith(prefix)) {
        var command_list = command.split(/ +/);
        command_list.shift();
        commandParser(command_list[0], command_list, message);
        return;
    }
    // bot being mentioned
    if (message.mentions.users.has(bot_id)) {
        console.log('here');
        parseBotMentions(message);
    }
});
function parseBotMentions(message) {
    message.channel.send("Hello, <@" + message.author.id + ">");
}
// receive event commands
function commandParser(primary_command, command_list, message) {
    if (!primary_command) {
        message.channel.send('Invalid Command. Type **cryptobot help** for command list.');
        return;
    }
    switch (primary_command) {
        case "list":
            list(command_list, message);
            break;
        case "help":
            help(command_list, message);
            break;
        case "commands":
            help(command_list, message);
            break;
        case "compare":
            compare(command_list, message);
            break;
        default:
            send_single_coin(command_list, message);
            break;
    }
}
// command branches
function help(command_list, message) {
    message.channel.send({ embed: new Help_1.default().returnHelpObject() });
}
function list(command_list, message) {
    var list_slice_request = command_list[1];
    if (!list_slice_request) {
        message.channel.send("<@" + message.author.id + ">\n" + new Ranking_1.default(prices).getObject());
        return;
    }
    //  parse slice string here
    var slice = parseRange(list_slice_request);
    message.channel.send("<@" + message.author.id + ">\n" + new Ranking_1.default(prices, slice[0], slice[1]).getObject());
    return;
}
function parseRange(number_range_string) {
    var range = number_range_string.split("-").map(function (string) { return parseInt(string); });
    console.log(range);
    return range;
}
function compare(command_list, message) {
    var coin_1 = command_list[1], coin_2 = command_list[2];
    var index_1 = getIndex(coin_1), index_2 = getIndex(coin_2);
    if (index_1 < 0 || index_2 < 0) {
        message.channel.send("Invalid coin identifier.");
        return;
    }
    message.channel.send(returnCompareString(index_1, index_2));
}
function send_single_coin(command_list, message) {
    return __awaiter(this, void 0, void 0, function () {
        var ticker, index, numics_object, _a, _b, err_4;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    ticker = command_list[0];
                    index = getIndex(ticker);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, get_by_token(ticker)];
                case 2:
                    numics_object = _d.sent();
                    console.log(numics_object);
                    // if (!numics_object[0]) throw Error()
                    // // new hotness
                    // let embed = await new Ticker(index, numics_object[0], prices, meta).getObject()
                    // // let body = await new Ticker(index, numics_object[0], prices, meta).render()
                    // message.channel.send({embed: embed})
                    // old embed version
                    _b = (_a = message.channel).send;
                    _c = {};
                    return [4 /*yield*/, new Ticker_1.default(index, numics_object[0], prices, meta).getObject()];
                case 3:
                    // if (!numics_object[0]) throw Error()
                    // // new hotness
                    // let embed = await new Ticker(index, numics_object[0], prices, meta).getObject()
                    // // let body = await new Ticker(index, numics_object[0], prices, meta).render()
                    // message.channel.send({embed: embed})
                    // old embed version
                    _b.apply(_a, [(_c.embed = _d.sent(), _c)]);
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _d.sent();
                    // if (index >= 0) {
                    //   message.channel.send({ embed: new Ticker(index, null, prices, meta).getObject() })
                    //   return
                    // }
                    message.channel.send('Invalid coin identifier.');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function returnCompareString(index_1, index_2) {
    var string = "e";
    return string;
}
function sendError(message) {
    message.channel.send('Invalid Command. Type **cryptobot help** for command list.');
    return;
}
function getIndex(symbol_or_name) {
    var index = prices.data.map(function (coin) { return coin.name.toLowerCase(); }).indexOf(symbol_or_name);
    if (index < 0)
        index = prices.data.map(function (coin) { return coin.symbol.toLowerCase(); }).indexOf(symbol_or_name);
    return index;
}
// args are optional options parameteres stacked after a hyphen, ie -dm
function parseArgs(args) {
    if (args.charAt(0) !== "-")
        return null;
}
function checkEmbedLength(embed) {
    return JSON.stringify(embed).length;
}
