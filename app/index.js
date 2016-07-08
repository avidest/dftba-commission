import React          from 'react'
import {Application}  from 'protium'
import router         from './router'
import * as reducers  from './reducers'

export default new Application({
  router,
  hot: true,
  store: {
    reducers,
    devTools: true,
    auth: {
      // initialize(store, http) {
      //   let token = cookie.load('token', { path: '/' })
      //   if (__SERVER__ && token && token.length) {
      //     store.dispatch(loadToken(token))
      //     if (http && http.req.user) {
      //       let user = http.req.user
      //       store.dispatch(loadProfile({
      //         name: user.name,
      //         email: user.email,
      //         email_verified: user.email_verified,
      //         picture: user.picture,
      //         role: user.role
      //       }))
      //     }
      //   }
      // },
      //
      // getBearer(store) {
      //   return store.getState().users.token
      // }
    },

    apiClient: {
      client: {
        base: '/api/v1',
        getBearerToken(state) {
          return state.users.token
        }
      },

      server: {
        port: process.env.API_PORT,
        base: '/api/v1'
      }
    }
  }
})

