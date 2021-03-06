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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var comma = require("comma-number");
var ordinal_1 = __importDefault(require("ordinal"));
// import Grid from './Grid'
var chart = require('asciichart');
var fetcher = require('node-fetch');
var request = require('request-promise');
require('dotenv').config();
var Ticker = /** @class */ (function () {
    function Ticker(tickerIndex, prices, meta_data, days) {
        if (tickerIndex === void 0) { tickerIndex = 0; }
        if (days === void 0) { days = 7; }
        this.tickerIndex = tickerIndex;
        this.prices = prices;
        this.meta_data = meta_data;
        this.days = days;
    }
    Ticker.prototype.returnPrice = function (index) {
        return {
            value: "Last Price (Updated " + moment_1.default(this.prices.data[index].quote.USD.last_updated).fromNow() + ")",
            name: "$" + comma(this.prices.data[index].quote.USD.price.toFixed(2)) + " (" + this.prices.data[index].quote.USD.percent_change_24h.toFixed(1) + "%)",
            inline: true,
        };
    };
    Ticker.prototype.returnMarketCap = function (index) {
        return {
            value: "Market Cap (USD)",
            name: "$" + comma(this.prices.data[index].quote.USD.market_cap.toFixed(2)) + " (" + ordinal_1.default(this.prices.data[index].cmc_rank) + ")",
            inline: true,
        };
    };
    Ticker.prototype.returnVolume = function (index) {
        return {
            value: "Volume (24h)",
            name: "$" + comma(this.prices.data[index].quote.USD.volume_24h.toFixed(0)),
            inline: true,
        };
    };
    Ticker.prototype.returnSupply = function (index) {
        return {
            value: "Supply (" + this.prices.data[index].symbol + ")",
            name: "" + comma(this.prices.data[index].total_supply),
            inline: true
        };
    };
    Ticker.prototype.returnSpacer = function () {
        return {
            name: '\u200B',
            value: '\u200B',
            inline: false
        };
    };
    Ticker.prototype.returnField = function (name, value, inline) {
        if (inline === void 0) { inline = false; }
        return {
            name: name,
            value: value,
            inline: inline
        };
    };
    Ticker.prototype.returnMetaData = function (index) {
        var field_array = [];
        if (this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.website) {
            field_array.push(this.returnField("Website", this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.website));
        }
        if (this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.technical_doc[0]) {
            field_array.push(this.returnField('White Paper', this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.technical_doc[0]));
        }
        if (this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.explorer[0]) {
            field_array.push(this.returnField('Blockchain Viewer', this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.explorer[0]));
        }
        if (this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.source_code[0]) {
            field_array.push(this.returnField('Source Code', this.meta_data.data[this.prices.data[this.tickerIndex].id].urls.source_code[0]));
        }
        return field_array;
    };
    Ticker.prototype.returnEmbedObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        color: 0x2ecc71,
                        title: this.prices.data[this.tickerIndex].name + " (" + this.prices.data[this.tickerIndex].symbol + ")",
                        description: "" + this.meta_data.data[this.prices.data[this.tickerIndex].id].description,
                        url: "https://coinmarketcap.com/currencies/" + this.prices.data[this.tickerIndex].slug + "/",
                        thumbnail: {
                            url: this.meta_data.data[this.prices.data[this.tickerIndex].id].logo,
                        },
                        fields: __spreadArray([
                            this.returnPrice(this.tickerIndex),
                            this.returnMarketCap(this.tickerIndex),
                            // this.returnSpacer(),
                            this.returnVolume(this.tickerIndex),
                            this.returnSupply(this.tickerIndex)
                        ], this.returnMetaData(this.tickerIndex)),
                        timestamp: new Date(),
                        footer: {
                            text: "Brought to you by CryptoBot",
                        },
                    }];
            });
        });
    };
    Ticker.prototype.returnTickerLayout = function () {
        var template = "";
        return template;
    };
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
    Ticker.prototype.getObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.returnEmbedObject()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Ticker;
}());
exports.default = Ticker;
var Point = /** @class */ (function () {
    function Point(date_string, price_string) {
        this.date = new Date(Date.parse(date_string));
        this.price = this.autoscale(parseFloat(price_string));
    }
    Point.prototype.autoscale = function (number) {
        var price = number;
        if (price > 1000)
            price = price / 1000;
        return price;
    };
    return Point;
}());
var Candle = /** @class */ (function () {
    function Candle(date, open, high, low, close) {
        this.date = new Date(date);
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
    }
    return Candle;
}());
