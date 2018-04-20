const path = require('path');

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
    node: {
        fs: "empty" // avoids error messages
    }
};
