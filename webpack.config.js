var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    app: [
      './app/client',
      'file?name=./styles.css!./assets/scss/index.scss'
    ]
  },

  output: {
    path: path.resolve('public'),
    filename: "[name].js",
    publicPath: '/assets/'
  },

  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.scss$/,
        loaders: ["extract", "css", "sass"]
      },
      {
        test: /\.jsx?$/,
        loaders: ["babel"],
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new webpack.DefinePlugin({
      CLIENT: true,
      SERVER: false
    })
  ]
}