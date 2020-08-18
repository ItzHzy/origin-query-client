const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


const rendererConfig = {
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    },
    entry: "./src/index.jsx",
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Cardname Studio',
        })
    ],
    stats: {
        colors: true,
        children: false,
        chunks: false,
        modules: false
    }
}

module.exports = [rendererConfig]