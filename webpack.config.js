var DevTools = require('protium/devtools').default
var merge = require('lodash').merge

var devtools = new DevTools(__dirname)

var serverOptions = {
  hot: true,
  environment: [
    'NODE_ENV',
    'AUTH0_CLIENT_ID',
    'AUTH0_DOMAIN',
    'APP_HOST',
    'SHOPIFY_SHOP'
  ]
}

var clientOptions = {
  hot: true,
  environment: [
    'NODE_ENV',
    'AUTH0_CLIENT_ID',
    'AUTH0_DOMAIN',
    'APP_HOST',
    'SHOPIFY_SHOP'
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['extract', 'css', 'sass']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file?name=images/[name].[ext]']
      }
    ]
  }
}

module.exports = [
  devtools.browserConfig([
    'file?name=styles.css!./assets/scss/index.scss',
    './app/client',
  ], clientOptions),
  devtools.serverConfig('./app/index', serverOptions)
]