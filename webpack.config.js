const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, '.'),
  entry: {
    app: './assets/vendor.js',
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'vendor.bundle.js',
  },
};