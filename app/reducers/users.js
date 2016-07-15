import {action, cookie} from 'protium'
import {push} from 'protium/router'

let lock;
if (__CLIENT__) {
  lock = new global.Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
}

const AUTH0_LOGIN         = 'dftba/AUTH0_LOGIN'
const AUTH0_LOGIN_SUCCESS = 'dftba/AUTH0_LOGIN_SUCCESS'
const AUTH0_LOGIN_FAIL    = 'dftba/AUTH0_LOGIN_FAIL'
const AUTH0_LOGOUT        = 'dftba/AUTH0_LOGOUT'

const AUTH0_LOAD_TOKEN    = 'dftba/AUTH0_LOAD_TOKEN'
const AUTH0_LOAD_PROFILE  = 'dftba/AUTH0_LOAD_PROFILE'


const initialState = {
  profile: null,
  token: null,
  selected: {},
  list: []
}

export default function usersReducer(state = initialState, action) {
  switch(action.type) {
    case AUTH0_LOAD_TOKEN:
      return { ...state, token: action.result }
    case AUTH0_LOAD_PROFILE:
      return { ...state, profile: action.result }
    case AUTH0_LOGIN_SUCCESS:
      return { ...state, profile: action.result.profile, token: action.result.token }
    case AUTH0_LOGOUT:
      return { ...state, profile: null, token: null, }
  }
  return state;
}


export const loadToken = action(AUTH0_LOAD_TOKEN).identity()

export const loadProfile = action(AUTH0_LOAD_PROFILE).identity()

export const login = action(AUTH0_LOGIN, AUTH0_LOGIN_SUCCESS, AUTH0_LOGIN_FAIL)
  .async(({client, payload, dispatch, getState})=> {
    let tok = cookie.load('token', { path: '/' })
    return new Promise((resolve, reject)=> {
      lock.show({
        icon: 'https://dftba-commission-staging.herokuapp.com/assets/images/logo.png',
        sso: false,
        theme: 'default a0-theme-dftba',
        disableSignupAction: true,
        closable: true,
        authParams: {
          scope: 'openid name email picture role'
        }
      }, (err, profile, token)=> {
        if (err) {
          console.error('Login', err)
          return
        }
        cookie.save('token', token, { path: '/' })
        resolve({ profile, token })

        if (profile.role === 'admin') {
          process.nextTick(x => {
            dispatch(push('/admin'))
          })
        } else {
          process.nextTick(x => {
            dispatch(push('/creators'))
          })
        }
      })
    })
  })

export const logout = action(AUTH0_LOGOUT)
  .sync(({client, payload, dispatch, getState})=> {
    const {users} = getState()
    if (users.token) {
      cookie.remove('token', { path: '/' })
      let protocol = __PRODUCTION__ ? 'https' : 'http'
      lock.logout({ 
        returnTo: `${protocol}://${process.env.APP_HOST}/`, 
        client_id: process.env.AUTH0_CLIENT_ID 
      })
    }
  })
