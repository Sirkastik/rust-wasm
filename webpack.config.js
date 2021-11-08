const path = require("path")
const HTMLWebpackPlugin = require('html-webpack-plugin')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
    entry: "./public/script.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './public/index.html'
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, '.')
        }),
        new CleanWebpackPlugin(),
        new GenerateSW()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ],
    },
    experiments: {
        asyncWebAssembly: true,
    }
}