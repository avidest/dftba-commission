import 'source-map-support/register'
import Express        from 'express'
import Path           from 'path'
import {renderer}     from 'protium/server'
import proxy          from './middleware/proxy'
import auth           from './middleware/auth'
import compression    from 'compression'
import {json}         from 'body-parser'
import cookie         from 'cookie-parser'
import cors           from 'cors'
import api            from './api'
import {setup as shopifySetup} from './services/shopify'
import {sync}         from './services/database'
import fs             from 'fs'

const VERSION = fs.readFileSync('.source-version')

export const server = Express()

server.get('/favicon.ico', (req, res)=> { res.sendStatus(404) })

server.use('/api', proxy)
server.use(compression())
server.use(cookie())
server.use(json())
server.use(auth)
server.use((err, req, res, next)=> {
  if (err.name === 'UnauthorizedError') {
    res.clearCookie('token')
    res.clearCookie('delegate')
    return res.redirect('/')
  }
  next(err)
})

if (__DEVELOPMENT__) {
  let DevTools = require('protium/devtools').default
  let webpackConfig = require('../webpack.config')
  let devtools = new DevTools(Path.resolve('.'))
  server.use(devtools.devMiddleware(webpackConfig))
}

server.use('/assets', Express.static('public'))

const assets = require('../webpack-assets.json')
const serverEntry = Path.resolve('public/server.js')

server.get('/*', renderer(serverEntry, {
  page: {
    main: [
      'https://cdn.auth0.com/js/lock/11.8.1/lock.min.js',
      assets.javascript.vendor + '?' + VERSION,
      assets.javascript.client + '?' + VERSION
    ]
  }
}))

export function setup() {
  sync(process.env.DATABASE_FORCE_SYNC)
  shopifySetup()
}

export function start(port, apiPort) {
  server.listen(port, function() {
    console.log(`\u2699 App listening on port ${port} ...`)

    api.listen(apiPort, function() {
      console.log(`\u2699 API listening on port ${apiPort} ...`)
    })
  })
}