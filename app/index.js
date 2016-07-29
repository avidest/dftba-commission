import React                  from 'react'
import {Application, cookie}  from 'protium'
import router                 from './router'
import * as reducers          from './ducks'
import {loadToken, loadProfile} from './ducks/users'

export default new Application({
  router,
  hot: true,
  store: {
    reducers,
    devTools: true,
    createMiddleware(middleware) {
      middleware.push(store => next => action => {
        if (action.error) {
          if (action.payload instanceof Response
                && !action.payload.bodyUsed
                && action.payload.json
          ) {
            action.payload.json().then(resp => console.log(resp))
          }
        }
        return next(action)
      })
      return middleware
    },
    auth: {
      initialize(store, http) {
        let token = cookie.load('token', { path: '/' })
        if (__SERVER__ && token && token.length) {
          store.dispatch(loadToken(token))
          if (http && http.req.user) {
            let user = http.req.user
            store.dispatch(loadProfile({
              name: user.name,
              email: user.email,
              email_verified: user.email_verified,
              picture: user.picture,
              role: user.role
            }))
          }
        }
      },
      
      getBearer(store) {
        return store.getState().users.token
      }
    },

    apiClient: {
      client: {
        base: '/api/v1/'
      },

      server: {
        port: process.env.API_PORT,
        base: '/api/v1/'
      }
    }
  }
})

