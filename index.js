require('babel-register')()
require('babel-polyfill')

global.SERVER = true
global.CLIENT = false


if (process.env.NODE_ENV === 'production' || require('piping')()) {
  require('./server').start(
    process.env.PORT || 9001,
    process.env.API_PORT || 9002
  )
}