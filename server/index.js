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

export const server = Express()


server.get('/favicon.ico', (req, res)=> {
  res.sendStatus(404)
})
server.use(compression())
server.use('/assets', Express.static('public'))
server.use(cookie())
server.use(json())
server.use(auth)
server.use('/api', proxy)

const rendererMiddleware = []
if (__DEVELOPMENT__) {
  let DevTools = require('protium/devtools').default
  let webpackConfig = require('../webpack.config')
  let devtools = new DevTools(Path.resolve('.'))
  rendererMiddleware.push(devtools.devMiddleware(webpackConfig))
}

const clientEntryPoint = require('../webpack-assets.json').javascript.client
server.get('/*', rendererMiddleware, renderer(x => {
  var appPath = require.resolve('../public/server')
  if (__DEVELOPMENT__) {
    delete require.cache[appPath]
  }
  return require(appPath).default
}, {
  page: {
    main: [
      'https://cdn.auth0.com/js/lock-9.1.min.js',
      clientEntryPoint
    ]
  }
}))

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