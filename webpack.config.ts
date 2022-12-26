import NodePolyfillPlugin from "node-polyfill-webpack-plugin"

module.exports = {
    transpileDependencies: true,
    // Other rules...
    plugins: [
        new NodePolyfillPlugin()
    ]
}