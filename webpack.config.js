const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, '.'),
  entry: {
    'bundle': './albatross.js',
    'bundle.min': './albatross.js'
  },

  // Build Javascript
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: 'albatross.[name].js',
  },

  module: {
    loaders: [
      // transpile ES6/7 to ES5 via babel
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
         loader: 'babel-loader',
         query: {
             presets: ['env']
         }
      },
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],

  devtool: 'source-map'
};