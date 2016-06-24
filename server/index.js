import Express from 'express'
import {renderer} from 'protium/router'
import proxy from './middleware/proxy'
import cors from 'cors'
import api from './api'
// import shopify from './services/shopify'
// import database from './services/database'

export const server = Express()

server.use('/api', proxy)

if (process.env.NODE_ENV !== 'production') {
  server.use(require('./middleware/dev').default)
}

server.use('/assets', Express.static('public'))

server.get('/*', (req, res)=> {
  var appPath = require.resolve('../dist/app-server')

  if (__DEVELOPMENT__) {
    delete require.cache[appPath]
  }

  var app = require('../dist/app-server').default

  return renderer(app)(req, res)
})

export function start(port, apiPort) {
  server.listen(port, function() {
    console.log(`\u2699 App listening on port ${port} ...`)

    api.listen(apiPort, function() {
      console.log(`\u2699 API listening on port ${apiPort} ...`)
    })
  })

  // database.sync({ force })
  // shopify.install()
}

//DEsktop

// API