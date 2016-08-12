var DevTools = require('protium/devtools').default
var merge = require('lodash').merge

var devtools = new DevTools(__dirname)

var opts = {
  hot: true,
  environment: [
    'NODE_ENV',
    'AUTH0_CLIENT_ID',
    'AUTH0_DOMAIN',
    'APP_HOST',
    'SHOPIFY_SHOP'
  ]
}

let browser = devtools.browserConfig([
  './app/client',
], opts)

let server = devtools.serverConfig('./app/index', opts)

module.exports = [browser, server]