import 'babel-polyfill'
import {Application} from 'protium'
import router        from './router'
import * as reducers from './reducers'

export default new Application({
  store: {
    reducers
  },
  router,
  page: {
    main: [
      'https://cdn.auth0.com/js/lock-9.1.min.js',
      '/assets/app.js'
    ]
  }
})
