const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

console.log()
var config = {
  entry: ['babel-polyfill', './src/main.js'],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        AUTHOR_NAME: JSON.stringify('Mario Nunes'),
        CONTACT_DETAILS: JSON.stringify('mnunes01@hotmail.com'),
        BUILD_DATE: JSON.stringify(new Date())
      }
    }),
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {
        from: 'public/index.html',
        to: './'
      },
      {
        from: 'public/assets/sounds/',
        to: './assets/sounds/'
      }
    ]),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'scracthcard',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true
      }
    ),
    new UglifyJSPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        sourceMap: true,
        output: {
          comments: false,
          beautify: false
        },
        warnings: false
      }
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }
        ]
      }
    ]
  }
}
module.exports = config
