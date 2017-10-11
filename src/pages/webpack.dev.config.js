var path = require('path')
const webpack = require('webpack')

var config = {
  entry: './src/main.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './public'),
    compress: true,
    inline: true,
    port: 8080
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        AUTHOR_NAME: JSON.stringify('Mario Nunes'),
        CONTACT_DETAILS: JSON.stringify('mnunes01@hotmail.com'),
        BUILD_DATE: JSON.stringify(new Date())
      }
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
