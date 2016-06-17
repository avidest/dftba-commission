require('babel-register')()
require('babel-polyfill')

global.SERVER = true
global.CLIENT = false

var pipingOpts = {
  ignore: /public|assets|app/
}

if (process.env.NODE_ENV === 'production' || require('piping')(pipingOpts)) {
  require('./server').start(
    process.env.PORT || 9001,
    process.env.API_PORT || 9002
  )
}