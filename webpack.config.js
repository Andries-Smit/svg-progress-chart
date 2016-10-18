// Webpack Config Object
module.exports = {
    context: __dirname,
    entry: "./app",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    }
}