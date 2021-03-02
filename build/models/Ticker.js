"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var comma = require("comma-number");
var ordinal_1 = __importDefault(require("ordinal"));
var Ticker = /** @class */ (function () {
    function Ticker(tickerIndex, numics_object, prices, meta_data) {
        if (tickerIndex === void 0) { tickerIndex = 0; }
        if (numics_object === void 0) { numics_object = {}; }
        this.tickerIndex = tickerIndex;
        this.coin_object = numics_object;
        this.prices = prices;
        this.meta_data = meta_data;
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
    Ticker.prototype.returnEmbedObject = function () {
        return {
            color: 0x2ecc71,
            title: this.prices.data[this.tickerIndex].name + " (" + this.prices.data[this.tickerIndex].symbol + ")",
            url: "https://coinmarketcap.com/currencies/" + this.prices.data[this.tickerIndex].slug + "/",
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
        };
    };
    Ticker.prototype.getObject = function () {
        return this.returnEmbedObject();
    };
    return Ticker;
}());
exports.default = Ticker;
