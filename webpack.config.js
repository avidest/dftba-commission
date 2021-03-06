var DevTools = require('protium/devtools').default
var merge = require('lodash').merge
var webpack = require('webpack')
var fs = require('fs')

if (process.env.SOURCE_VERSION) {
  fs.writeFileSync('.source-version', process.env.SOURCE_VERSION)
}

var devtools = new DevTools(__dirname)

var opts = {
  hot: true,
  environment: [
    'NODE_ENV',
    'AUTH0_CLIENT_ID',
    'AUTH0_DOMAIN',
    'APP_HOST',
    'SHOPIFY_SHOP'
  ],
  vendorLibs: [
    'react-bootstrap',
    'react-bounds-deux',
    'react-datepicker',
    'react-loaders',
    'react-notifications',
    'react-timeago',
    'lodash',
    'classnames',
    'moment',
    'redux-form'
  ],
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
  ]
}

let browser = devtools.browserConfig([
  './app/client',
], opts)

let server = devtools.serverConfig('./app/index', opts)

module.exports = [browser, server]