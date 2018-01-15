const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const Babel = require('babel-loader');
const cssLoader = require('css-loader');
const styleLoader = require('style-loader');
const fileLoader = require('file-loader');

module.exports = {
  context: path.resolve(__dirname, '.'),
  entry: {
    'js/vendor.bundle.js':     './albatross.js',
    'js/vendor.bundle.min.js': './albatross.js',
    'css/vendor.css': [
      './node_modules/bootstrap/dist/css/bootstrap.min.css',
      './node_modules/adminlite/dist/css/styles.min.css'
    ],
  },

  output: {
    path: path.resolve(__dirname, 'static'),
    filename: '[name]',
  },

  module: {
    rules: [
      // transpile ES6/7 to ES5 via babel
      {
        test: /\.js$/,
         loader: 'babel-loader',
         query: {
             presets: ['env']
         }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: "css-loader",
            options: {
              alias: {
                "../fonts/": "fonts/bootstrap/"
              }
            }
          }
        })
      },
    //   {
    //     test: /\.scss$/,
    //     loaders: ['style', 'css', 'postcss', 'sass']
    //   },
    //   {
    //     test: /\.less$/,
    //     loaders: ['style', 'css', 'less']
    //   },
      {
        test: /\.woff$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
      },
      {
        test: /\.woff2$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
      },
      {
        test: /\.(eot|ttf|svg|gif|png)$/,
        loader: "file-loader"
      },
    ],
  },

  // Uglify JS
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new ExtractTextPlugin("css/vendor.css"),
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