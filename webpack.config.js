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
    // Main vendor JS
    'js/vendor.bundle.js':     './build/js/vendor.js',
    'js/vendor.bundle.min.js': './build/js/vendor.js',

    // Bootstrap native bundle - needs to be appended
    'js/vendor.bootstrap.native.min.js': './build/js/vendor.bootstrap.native.js',

    // Vendor CSS - already minified as from libraries
    'css/vendor.css': [
      './node_modules/bootstrap/dist/css/bootstrap.min.css',
      './node_modules/adminlite/dist/css/styles.min.css',
      './node_modules/adminlite/dist/css/skin_black.min.css',
      './node_modules/font-awesome/css/font-awesome.min.css',
      './node_modules/ionicons/dist/css/ionicons.min.css'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'static'),
    filename: '[name]',
    publicPath: '../' // Fix URL Resolutions for CSS
  },

  module: {
    rules: [
      // Transpile ES6/7 to ES5 via babel
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        },
      },

      // CSS/LESS/SASS extraction
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: "css-loader",
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback:'style-loader',
          use:['css-loader','less-loader'],
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback:'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ],
        })
      },

      // Fonts/Images/Files extraction
      {
        test: /\.woff$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff&name=./build/fonts/[name].[hash].[ext]"
      },
      {
        test: /\.woff2$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=./build/fonts/[name].[hash].[ext]"
      },
      {
        test: /\.(svg|gif|png)$/,
        loader: "file-loader?name=images/[name].[hash].[ext]"
      },
      {
        test: /\.(eot|ttf)$/,
        loader: "file-loader?name=fonts/[name].[hash].[ext]"
      },
    ],
  },

  // Uglify JS
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new ExtractTextPlugin('[name]'),
  ],

  devtool: 'source-map',
};