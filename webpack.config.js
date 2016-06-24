var path = require('path')
var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = [
  config('browser'),
  config('server')
]

function config(target) {


  var BROWSER = target === 'browser';
  var SERVER = !BROWSER

  var entry = {}

  if (BROWSER) {
    entry['app'] = [
      './app/client',
      'file?name=./styles.css!./assets/scss/index.scss'
    ]
  }

  if (SERVER) {
    entry['app-server'] = [
      './app/index'
    ]
  }

  var plugins = [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'AUTH0_CLIENT_ID',
      'AUTH0_DOMAIN',
      'APP_HOST'
    ]),
    new webpack.DefinePlugin({
      CLIENT: BROWSER,
      SERVER: SERVER
    })
  ]

  var conf = {

    entry,

    output: {
      path: BROWSER ? path.resolve('public') : path.resolve('dist'),
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

    plugins

  }


  if (SERVER) {
    conf.output.libraryTarget = 'commonjs'
    conf.externals = [nodeExternals()]
    conf.target = 'node'
    conf.node = {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
      setImmediate: false
    }
  }

  return conf
}