const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

module.exports = {

  entry: glob.sync('./src/@(components|js)/**/*.js'),

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        use: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },

  plugins: [
  ]

}
