import {createAction, handleActions, cookie} from 'protium'
import {push} from 'protium/router'
import {performLogin, performLogout} from '../services/auth'

export const loadToken = createAction('dftba/AUTH0_LOAD_TOKEN')

export const loadProfile = createAction('dftba/AUTH0_LOAD_PROFILE')

export const login = createAction('dftba/AUTH0_LOGIN', payload => {
  return ({dispatch})=> {
    return performLogin().then(result => {
      let expires = new Date()
      expires.setSeconds(expires.getSeconds() + 36000)
      cookie.save('token', result.token, { path: '/', expires })

      process.nextTick(x => {
        dispatch(push(result.profile.role === 'admin' ? '/admin' : '/creator'))
      })

      return result
    })
  }
})

export const logout = createAction('dftba/AUTH0_LOGOUT', payload => {
  return ({getState})=> {
    const {users} = getState()
    if (users.token) {
      cookie.remove('token', { path: '/' })
      performLogout()
    }
  }
})

export const loadUsers = createAction('dftba/AUTH0_LOAD_USERS', payload => {
  return ({client})=> {
    return client.get('/users')
      .then(users => {
        return users.map(user => {
          if (user.app_metadata) {
            user.role = user.app_metadata.role
          }
          return user;
        })
      })
  }
})

export const loadUser = createAction('dftba/AUTH0_LOAD_USER', payload => {
  return ({client})=> {
    return client.get(`/users/${payload.id}`)
      .then(user => {
        if (user.app_metadata) {
          user.role = user.app_metadata.role
        }
        return user
      })
  }
})
export const createUser = createAction('dftba/AUTH0_CREATE_USER', payload => {
  return ({client})=> {
    return client.post(`/users`, {
      body: payload
    })
  }
})

export const updateUser = createAction('dftba/AUTH0_UPDATE_USER', payload => {
  return ({client, dispatch})=> {
    return client.put(`/users/${payload.user_id}`, {
      body: payload
    }).then(x => {
      dispatch(loadUsers())
      return x
    })
  }
})

export const removeUser = createAction('dftba/AUTH0_REMOVE_USER', payload => {
  return ({client, dispatch})=> {
    return client.del(`/users/${payload.user_id}`)
      .then(x => dispatch(loadUsers()))
  }
})

const initialState = {
  profile: null,
  token: null,
  selected: {},
  list: []
}

export default handleActions({
  [loadToken]: (state, action) => ({ ...state, token: action.payload }),
  [loadProfile]: (state, action) => ({ ...state, profile: action.payload }),
  [login]: (state, action) => ({ ...state, profile: action.payload.profile, token: action.payload.token }),
  [logout]: (state, action) => ({ ...state, profile: null, token: null }),
  [loadUsers]: (state, action) => ({ ...state, list: action.payload }),
  [loadUser]: updateSelectedUser,
  [createUser]: updateSelectedUser,
  [updateUser]: updateSelectedUser
}, initialState)

function updateSelectedUser(state, action) {
  console.log('update user', action.payload)
  return { ...state, selected: action.payload }
}
