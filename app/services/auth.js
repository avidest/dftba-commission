let lock;
if (__CLIENT__) {
  lock = new global.Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
}

export function performLogin() {
  return new Promise((resolve, reject)=> {
    if (!lock) return Promise.resolve(null);
    return lock.show({
      icon: `//${process.env.APP_HOST}/assets/images/logo.png`,
      sso: false,
      theme: 'default a0-theme-dftba',
      disableSignupAction: true,
      closable: true,
      authParams: {
        scope: 'user_id openid email picture user_metadata app_metadata'
      }
    }, (err, profile, token)=> {
      if (err) {
        throw err
      }
      resolve({ profile, token })
    })
  })
}

export function performLogout() {
  if (!lock) return;
  let protocol = __PRODUCTION__ ? 'https' : 'http'
  lock.logout({
    returnTo: `${protocol}://${process.env.APP_HOST}/`,
    client_id: process.env.AUTH0_CLIENT_ID
  })
}