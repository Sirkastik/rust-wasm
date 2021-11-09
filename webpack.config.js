const path = require("path")
const HTMLWebpackPlugin = require('html-webpack-plugin')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/js/script.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './public/index.html'
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, '.')
        }),
        new GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/icons/', to: 'icons/' },
                { from: 'public/favicon.ico' },
                { from: 'public/manifest.json' }
            ]
        })
    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }],
    },
    experiments: {
        asyncWebAssembly: true,
    }
}