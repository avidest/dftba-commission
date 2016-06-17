import Express from 'express'
import {renderer} from 'protium/router'
import proxy from './middleware/proxy'
import app from '../app'
import api from './api'

export const server = Express()

server.use('/api', proxy)

if (process.env.NODE_ENV !== 'production') {
  server.use(require('./middleware/dev').default)
}

server.use('/assets', Express.static('public'))

server.get('/*', (req, res)=> {
  return renderer(app)(req, res)
})

export function start(port, apiPort) {
  server.listen(port, function() {
    console.log(`\u2699 App listening on port ${port} ...`)

    api.listen(apiPort, function() {
      console.log(`\u2699 API listening on port ${apiPort} ...`)
    })
  })
}

//DEsktop

// API