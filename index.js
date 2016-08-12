require('source-map-support/register')
require('babel-polyfill')
require('babel-register')({
  presets: [
    ['es2015', {modules: 'commonjs'}],
    'stage-0',
    'react'
  ],
  plugins: [
    'transform-decorators-legacy'
  ]
})

global.__SERVER__ = true
global.__CLIENT__ = false
global.__PRODUCTION__ = process.env.NODE_ENV === 'production'
global.__DEVELOPMENT__ = !global.__PRODUCTION__

var pipingOpts = {
  ignore: /(\/\.|~$)|(\/app|assets|public|dist\/.+)|webpack-assets/
}

if (__PRODUCTION__ || require('piping')(pipingOpts)) {
  require('./server').start(
    process.env.PORT || 9001,
    process.env.API_PORT || 9002
  )
}