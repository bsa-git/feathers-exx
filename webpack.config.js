const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    // context: path.resolve(__dirname, 'client/src'), // source directory
    context: path.resolve(__dirname), // source directory
    entry: { // file for assembly, if several - specify hash (entry name => filename)
        'polyfills': './client/src/js/polyfills.js',
        'app.client': './client/src/js/app.client.js'
    },
    output: {
        path: path.resolve(__dirname, 'client/public/js'), // output directory
        filename: '[name].bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {test: /\.twig$/, use: "twig-loader"},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {
                test: /\.js$/,
                // exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    plugins: [
        new Dotenv({
            path: './.env', // Path to .env file (this is the default)
            systemvars: true // It makes it possible to work in production mode on Heroku hosting
        })
    ],
    resolve: {
        alias: {
            joi: 'joi-browser'
        }
    },
    node: {
        fs: "empty" // avoids error messages
    }
};
