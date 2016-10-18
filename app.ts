import { SVGChart } from './svgChart';

module app {
    "use strict";
    var chart = new SVGChart("SVGChart", {
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
    window['progressBar'] = chart;
    console.log(`${chart.id} Loaded!`);
}