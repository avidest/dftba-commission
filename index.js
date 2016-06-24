require('babel-register')()
require('babel-polyfill')

global.SERVER = true
global.CLIENT = false
global.__PRODUCTION__ = process.env.NODE_ENV === 'production'
global.__DEVELOPMENT__ = !global.__PRODUCTION__

var pipingOpts = {
  ignore: /public|assets|app|dist/
}

if (process.env.NODE_ENV === 'production' || require('piping')(pipingOpts)) {
  require('./server').start(
    process.env.PORT || 9001,
    process.env.API_PORT || 9002
  )
}