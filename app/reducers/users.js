import {action} from 'protium'

let lock;
if (CLIENT) {
  lock = new global.Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
}

const AUTH0_LOGIN         = 'dftba/AUTH0_LOGIN'
const AUTH0_LOGIN_SUCCESS = 'dftba/AUTH0_LOGIN_SUCCESS'
const AUTH0_LOGIN_FAIL    = 'dftba/AUTH0_LOGIN_FAIL'

const AUTH0_LOGOUT            = 'dftba/AUTH0_LOGOUT'

export const login = action(AUTH0_LOGIN, AUTH0_LOGIN_SUCCESS, AUTH0_LOGIN_FAIL)
  .async((client, payload, dispatch, getState)=> {
    let tok = localStorage.getItem('auth0_token')
    if (tok && tok.length) {
      return new Promise((resolve, reject)=> {
        lock.getProfile(tok, (err, profile)=> {
          if (err) {
            console.error('Login Error', err)
            return reject(err)
          }
          resolve({ profile, token: tok })
        })
      })
    }

    return new Promise((resolve, reject)=> {
      lock.show({
        sso: false,
        disableSignupAction: true,
        closable: false
      }, (err, profile, token)=> {
        if (err) {
          console.error('Login Error', err)
          return reject(err)
        }
        localStorage.setItem('auth0_token', token)
        resolve({ profile, token })
      })
    })
  })

export const logout = action(AUTH0_LOGOUT)
  .sync((client, payload, dispatch, getState)=> {
    const {users} = getState()
    if (users.token) {
      localStorage.removeItem('auth0_token')
      lock.logout({ ref: `http://${process.env.APP_HOST}/` })
    }
  })

const initialState = {
  profile: null,
  token: null,
  selected: {},
  list: [
    {id: 1, name: 'Kat Gritzmacher', role: 'admin', email: 'kat@3five.com'},
    {id: 2, name: 'Jon Jaques', role: 'admin', email: 'jon@3five.com'},
    {id: 3, name: 'Dave Loos', role: 'admin', email: 'dave@dftba.com'},
    {id: 4, name: 'Random Guy', role: 'merchant', email: 'some@guy.com'},
  ]
}

export default function usersReducer(state = initialState, action) {
  switch(action.type) {
    case AUTH0_LOGIN_SUCCESS:
      return { ...state, profile: action.result.profile, token: action.result.token }
    case AUTH0_LOGOUT:
      return { ...state, profile: null, token: null, }
  }
  return state;
}