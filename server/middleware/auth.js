import JWT from 'express-jwt'

const secret = new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64')
const audience = process.env.AUTH0_CLIENT_ID

const authenticator = JWT({ 
  secret, 
  audience, 
  getToken,
  credentialsRequired: false
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