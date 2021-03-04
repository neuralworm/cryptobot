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
                    name: "cryptobot *coin_symbol || coin_name*",
                    value: "List information about single coin. (Use like: cryptobot btc)"
                }
            ]
        };
    };
    return HelpObject;
}());
exports.default = HelpObject;
