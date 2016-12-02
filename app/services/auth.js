let lock;
if (__CLIENT__) {
  lock = new global.Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
}

export function performLogin() {
  return new Promise((resolve, reject)=> {
    if (!lock) return Promise.resolve(null);
    return lock.show({
      icon: false,
      sso: false,
      theme: 'default a0-theme-dftba',
      disableSignupAction: true,
      closable: false,
      container: 'login-container',
      authParams: {
        scope: 'user_id openid email picture user_metadata app_metadata'
      }
    }, (err, profile, token)=> {
      if (err) {
        return
      }
      resolve({ profile, token })
    })
  })
}

export function performLogout() {
  if (!lock) return;
  lock.logout({
    returnTo: `${location.protocol}//${location.host}/`,
    client_id: process.env.AUTH0_CLIENT_ID
  })
}