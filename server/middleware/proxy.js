import proxy          from 'express-http-proxy'
import url            from 'url'

// Proxy to API server
const target = 'http://localhost:' + process.env.API_PORT

export default proxy(target, {
  forwardPath(req) {
    let parsed = url.parse(req.url).path
    let path = `/api${parsed === '/' ? '' : parsed}`
    return path
  }
})