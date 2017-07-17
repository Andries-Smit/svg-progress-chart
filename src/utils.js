"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils;
(function (Utils) {
    Utils.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window['webkitRequestAnimationFrame'] ||
            window['mozRequestAnimationFrame'] ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
})(Utils = exports.Utils || (exports.Utils = {}));
