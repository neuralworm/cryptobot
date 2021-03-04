"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var comma = require('comma-number');
var Comparison = /** @class */ (function () {
    function Comparison(comparison_indexes, prices) {
        this.comparison_indexes = comparison_indexes;
        this.prices = prices;
        console.log('rendering comparison of' + this.comparison_indexes);
    }
    Comparison.prototype.getRow = function (index) {
        var row = '';
        // console.log(this.prices.data[index])
        row += this.getCell(5, this.prices.data[index].symbol, false);
        row += this.getCell(10, this.prices.data[index].name, false);
        row += this.getCell(7, this.prices.data[index].quote.USD.percent_change_1h.toFixed(2) + "%");
        row += this.getCell(7, this.prices.data[index].quote.USD.percent_change_24h.toFixed(2) + "%");
        row += this.getCell(7, this.prices.data[index].quote.USD.percent_change_7d.toFixed(2) + "%");
        row += this.getCell(18, "$" + comma((this.prices.data[index].quote.USD.volume_24h).toFixed(0)));
        return row + "\n";
    };
    Comparison.prototype.getCell = function (width, string, padding) {
        if (padding === void 0) { padding = true; }
        var substring = string.toString().substr(0, width);
        substring = padding ? substring.padStart(width, " ") : substring.padEnd(width, " ");
        return "[" + substring + "]";
    };
    Comparison.prototype.render = function () {
        var _this = this;
        var header = "[SYMB ][NAME      ][     1H][    24H][     7D][      VOLUME (USD)]\n";
        this.comparison_indexes.forEach(function (index) {
            header += _this.getRow(index);
        });
        return "```" + header + "```";
    };
    return Comparison;
}());
exports.default = Comparison;
