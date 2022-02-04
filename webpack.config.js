const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // instead of style-loader
                    'css-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Nome do Site',
            header: 'Webpack Example Title',
            metaDesc: 'Descrição para SEO do site.',
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: "Nome do Site - edit mode",
            template: "./src/edit.html",
            filename:'edit.html',
            inject:'body',
            chunks:['edit'],
            excludeChunks:['main']
            
        }),
        new MiniCssExtractPlugin({

        }),
    ],
  mode: 'development',
};