import React                  from 'react'
import {Application, cookie}  from 'protium'
import router                 from './router'
import errorReporter          from './services/error-reporter'
import * as storeInitializer  from './services/store-initializer'
import * as reducers          from './ducks'

export default new Application({
  hot: true,
  router,
  page: {
  },
  store: {
    reducers,
    auth: storeInitializer,
    apiClient: {
      client: {
        base: '/api/v1/'
      },

      server: {
        port: process.env.API_PORT,
        base: '/api/v1/'
      }
    },
    devTools: true,
    createMiddleware(middleware) {
      middleware.push(errorReporter)
      return middleware
    }
  }
})