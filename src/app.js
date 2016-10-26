"use strict";
var svgProgress_1 = require("./svgProgress");
var app;
(function (app) {
    var chart = new svgProgress_1.SVGProgressChart("SVGChart", {
        width: 800,
        height: 100,
        time: 450,
        data: [{
                type: "positive",
                width: 10
            },
            {
                type: "neutral",
                width: 10
            },
            {
                type: "negative",
                width: 20
            }, {
                type: "positive",
                width: 5
            }]
    });
})(app || (app = {}));
