import qs from 'qs'

let lock;
if (__CLIENT__) {
  lock = new global.Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN, {
    languageDictionary: {
      title: ""
    },
    theme: {
      logo: `//${process.env.APP_HOST}/assets/images/logo.png`,
      primaryColor: '#80ead0'
    },
    auth: {
      sso: false,
      redirectUrl: `https://${process.env.APP_HOST}/`,
      responseType: 'token',
      params: {
        scope: 'user_id openid email picture user_metadata app_metadata'
      }
    }
  })
}

function getAccessToken() {
  let token = false
  if (global.__ACCESS_DATA__ 
    && global.__ACCESS_DATA__.hash
    && global.__ACCESS_DATA__.hash.length > 2) {
    let query = qs.parse(global.__ACCESS_DATA__.hash.slice(1))
    if (query && query.access_token) {
      return query
    }
  }
  return token
}

export function performLogin() {
  let payload = getAccessToken()
  return new Promise((resolve, reject)=> {
    if (!lock) return Promise.resolve(null);
    if (!payload) return lock.show()
    if (payload) {
      return lock.getUserInfo(payload.access_token, (err, profile)=> {
        if (err) {
          return
        }
        resolve({ profile, token: payload.id_token })
      })
    }
  })
}

export function performLogout() {
  if (!lock) return;
  lock.logout({
    returnTo: `${location.protocol}//${location.host}/`,
    client_id: process.env.AUTH0_CLIENT_ID
  })
}