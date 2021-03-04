"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var comma = require('comma-number');
var Ranking = /** @class */ (function () {
    function Ranking(prices, slice_start, slice_end) {
        if (slice_start === void 0) { slice_start = 1; }
        if (slice_end === void 0) { slice_end = 25; }
        this.prices = prices;
        this.slice_start = slice_start;
        this.slice_end = slice_end - slice_start < 25 ? slice_end : slice_start + 25;
    }
    Ranking.prototype.returnField = function (index, prices) {
        return [
            {
                name: index + 1 + ". " + prices.data[index].name + " (" + prices.data[index].symbol + ")",
                value: "$" + comma(prices.data[index].quote.USD.price.toFixed(2)),
                inline: true,
            },
            {
                name: "Market Cap (USD)",
                value: "$" + comma(prices.data[index].quote.USD.market_cap.toFixed(2)),
                inline: true,
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: false
            },
        ];
    };
    Ranking.prototype.returnFields = function (slice_start, slice_end) {
        var fields = [];
        for (var i = slice_start - 1; i < slice_end; i++) {
            // fields.push(this.returnField(i))
            fields = __spreadArray(__spreadArray([], fields), this.returnField(i, this.prices));
        }
        return fields;
    };
    Ranking.prototype.returnEmbedObject = function () {
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
        };
    };
    Ranking.prototype.getObject = function () {
        return this.returnCodeBlock();
    };
    // code block formatting
    Ranking.prototype.returnCodeBlock = function () {
        var table_columns = "[RNK][SYMB ][NAME        ][PRICE  (USD)][CAP  (USD)][    24H][     7D]\n";
        var string_template = "" + table_columns;
        for (var i = this.slice_start - 1; i < this.slice_end; i++) {
            string_template += this.returnStatRow(i);
        }
        console.log(string_template.length);
        return "\`\`\`" + string_template + "\`\`\`";
    };
    Ranking.prototype.returnStatBlock = function (string, length, padding) {
        if (length === void 0) { length = 10; }
        if (padding === void 0) { padding = true; }
        var substring = string.toString().substr(0, length);
        substring = padding ? substring.padStart(length, " ") : substring.padEnd(length, " ");
        return "[" + substring + "]";
    };
    Ranking.prototype.returnStatRow = function (index) {
        var price_object = this.prices.data[index];
        var entry_template = "" + this.returnStatBlock(price_object.cmc_rank, 3) + this.returnStatBlock(price_object.symbol.toUpperCase(), 5, false) + this.returnStatBlock(price_object.name, 12, false) + this.returnStatBlock(comma((price_object.quote.USD.price).toFixed(2)), 12) + this.returnStatBlock(comma((price_object.quote.USD.market_cap / 1000000).toFixed(0)) + "M", 10) + this.returnStatBlock((price_object.quote.USD.percent_change_24h).toFixed(1) + "%", 7) + this.returnStatBlock((price_object.quote.USD.percent_change_7d).toFixed(1) + "%", 7) + "\n";
        return entry_template;
    };
    return Ranking;
}());
exports.default = Ranking;
