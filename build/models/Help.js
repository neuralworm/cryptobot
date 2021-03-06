"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpObject = /** @class */ (function () {
    function HelpObject() {
    }
    HelpObject.prototype.returnHelpObject = function () {
        return {
            title: "Cryptobot Commands",
            fields: [
                {
                    name: "cryptobot list",
                    value: 'List current information on top 5 cryptos.'
                },
                {
                    name: "cryptobot list 50-75",
                    value: "Query cryptocurrenies ranked by market cap (max 25)"
                },
                {
                    name: "cryptobot symbol/name",
                    value: "List information about single coin. (i.e. cryptobot btc)"
                },
                {
                    name: "cryptobot compare c1 c2 c3 c4",
                    value: "Compare recent market performance of several cryptocurrencies."
                }
            ]
        };
    };
    return HelpObject;
}());
exports.default = HelpObject;
