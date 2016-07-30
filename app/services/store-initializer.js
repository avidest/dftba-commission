import {cookie} from 'protium'
import {loadToken, loadProfile} from '../ducks/users'

export function getBearer(store) {
  return store.getState().users.token
}

export function initialize(store, http) {
  let token = cookie.load('token', { path: '/' })
  if (__SERVER__ && token && token.length) {
    store.dispatch(loadToken(token))
    if (http && http.req.user) {
      let user = http.req.user
      store.dispatch(loadProfile({
        user_id: user.user_id,
        user_metadata: user.user_metadata,
        email: user.email,
        email_verified: user.email_verified,
        picture: user.picture,
        app_metadata: user.app_metadata
      }))
    }
  }
}