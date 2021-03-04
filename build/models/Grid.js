"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid = /** @class */ (function () {
    function Grid(width, height) {
        if (width === void 0) { width = 40; }
        if (height === void 0) { height = 20; }
        this.width = width;
        this.height = height;
        this.coordinates = this.init_coordinates();
    }
    Grid.prototype.init_coordinates = function () {
        var _this = this;
        var array = Array.from({ length: this.height }, function () {
            return Array.from({ length: _this.width }, function () { return " "; });
        });
        return array;
    };
    return Grid;
}());
exports.default = Grid;
