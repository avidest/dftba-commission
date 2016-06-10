import JWT from 'express-jwt'

const authenticator = JWT({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET),
  audience: process.env.AUTH0_CLIENT_ID
})

export default function(req, res, next) {
  return authenticator(req, res, next)
}