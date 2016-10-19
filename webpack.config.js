// Webpack Config Object
module.exports = {
    context: __dirname,
    entry: "./src/app",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    }
}