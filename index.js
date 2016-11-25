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

// Serialize process.env for perf
process.env = JSON.parse(JSON.stringify(process.env))

global.__SERVER__ = true
global.__CLIENT__ = false
global.__PRODUCTION__ = process.env.NODE_ENV === 'production'
global.__DEVELOPMENT__ = !global.__PRODUCTION__

var workers = process.env.WEB_CONCURRENCY || 1;
var throng = require('throng')
var server = require('./server')
throng({
  workers: workers,
  lifetime: Infinity,
  master: function() {
    server.setup()
  },
  start: function(id) {
    console.log('Worker ' + id + ' starting...')
    server.start(
      process.env.PORT || 9001,
      process.env.API_PORT || 9002
    )
    process.on('SIGTERM', function() {
      console.log(`Worker ${id} exiting`);
      process.exit();
    });
  }
})
