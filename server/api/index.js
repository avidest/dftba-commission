import Express                  from 'express'
import bodyParser               from 'body-parser'
import cookies                  from 'cookie-parser'
import compression              from 'compression'
import * as database            from '../services/database'
import auth                     from '../middleware/auth'
import router                   from './router'

const api = Express()
export default api

database.sync(process.env.DATABASE_FORCE_SYNC)

api.use(compression())
api.use(bodyParser.urlencoded({ extended: true }))
api.use(bodyParser.json())
api.use(cookies())
api.use(auth)

api.use((req, res, next)=> {
  console.log(req.method, req.url, req.body)
  next()
})
api.use('/api/v1', router)

api.use((err, req, res, next)=> {
  if (err.status) {
    res.status(err.status)
  }
  res.json(err)
})