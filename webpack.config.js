const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Babel = require('babel-loader');

module.exports = {
  context: path.resolve(__dirname, '.'),
  entry: {
    'bundle': './albatross.js',
    'bundle.min': './albatross.js',
    // 'bundle.min.css': [
    //   './node_modules/bootstrap/dist/css/bootstrap.css'
    // ],
  },

  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: 'albatross.[name].js',
  },

  module: {
    loaders: [
      // transpile ES6/7 to ES5 via babel
      {
        test: /\.js$/,
         loader: 'babel-loader',
         query: {
             presets: ['env']
         }
      },
    ],
    // rules: [
    //   {
    //     test: /\.css$/,
    //     use: ExtractTextPlugin.extract({
    //       fallback: 'style-loader',
    //       use: 'css-loader'
    //     })
    //   },
    //   {
    //     test: /\.scss$/,
    //     loaders: ['style', 'css', 'postcss', 'sass']
    //   },
    //   {
    //     test: /\.less$/,
    //     loaders: ['style', 'css', 'less']
    //   },
    //   {
    //     test: /\.woff$/,
    //     loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
    //   },
    //   {
    //     test: /\.woff2$/,
    //     loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
    //   },
    //   {
    //     test: /\.(eot|ttf|svg|gif|png)$/,
    //     loader: "file-loader"
    //   }
    // ],
  },

  // Uglify JS
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],

  devtool: 'source-map',

  // Merge Library CSS
  // - bootstrap
  // - adminlite
  //
  // - fontawsome
  // - ionicons
  // plugins: [
  //   new ExtractTextPlugin("bundle.min.css"),
  // ],
};