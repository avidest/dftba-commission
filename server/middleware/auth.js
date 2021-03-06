import JWT from 'express-jwt'

const secret = process.env.AUTH0_CLIENT_SECRET
const audience = process.env.AUTH0_CLIENT_ID

const authenticator = JWT({ 
  secret, 
  audience, 
  getToken,
  credentialsRequired: true
}).unless(function(req) {
  var paths = [
    '/settings',
    '/shopify',
    '/api/v1/settings',
    '/api/v1/shopify',
    '/__webpack_hmr',
    '/assets'
  ]
  return req.url === '/' || paths.some(path => {
    return req.url.startsWith(path)
  })
})

export default function(req, res, next) {
  return authenticator(req, res, next)
}

function getToken(req) {
  let token = null;
  if (req.headers.authorization 
        && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  return token;
}