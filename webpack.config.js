const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

function resolve (dir) {
    return path.resolve(__dirname, dir)
}

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        publicPath: './',
        path: resolve('dist'),
        filename: 'bundle.js'
        // filename: '[name]-[hash].js'
    },
    devServer: {
        port: 9000,
        hot: true,
        contentBase: 'src'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            // template: './public/index.html',
            filename: 'index.html'
        })
    ]
};
