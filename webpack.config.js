// Webpack Config Object
module.exports = {
    context: __dirname,
    entry: "./src/app",
    output: {
        path: __dirname + "/dist",
        filename: "svg-progress-chart.js"
    }
}