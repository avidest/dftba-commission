import {Application} from 'protium'
import router        from './router'
import * as reducers from './reducers'

export default new Application({
  store: {
    reducers
  },
  router
})