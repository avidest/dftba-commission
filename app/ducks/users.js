import {createAction, handleActions, cookie} from 'protium'
import {push} from 'protium/router'
import {performLogin, performLogout} from '../services/auth'
import {successNotification, errorNotification} from './helpers/notifications'

export const loadToken = createAction('dftba/AUTH0_LOAD_TOKEN')

export const loadProfile = createAction('dftba/AUTH0_LOAD_PROFILE')

export const resetUser = createAction('dftba/AUTH0_RESET_USER')

export const login = createAction('dftba/AUTH0_LOGIN', payload => {
  return ({dispatch, getState})=> {
    return performLogin().then(result => {
      let expires = new Date()
      expires.setSeconds(expires.getSeconds() + 36000)
      cookie.save('token', result.token, { path: '/', expires })
      process.nextTick(x => {
        dispatch(push(result.profile.app_metadata.role === 'admin' ? '/admin' : `/creator?user=${result.profile.user_id}`))
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
    return client.get('/users', {
      query: {
        limit: 500
      }
    })
  }
})

export const loadCreators = createAction('dftba/AUTH0_LOAD_CREATORS', payload => {
  return ({client})=> {
    return client.get('/users/creators', {
      query: {
        limit: 500
      }
    })
  }
})

export const loadUser = createAction('dftba/AUTH0_LOAD_USER', payload => {
  return ({client})=> {
    return client.get(`/users/${payload.id || payload.user_id}`, {
      query: {
        include: []
      }
    })
  }
})

export const createUser = createAction('dftba/AUTH0_CREATE_USER', payload => {
  return ({client, dispatch})=> {
    return client.post(`/users`, {
      body: payload
    }).then(user => {
      setTimeout(x => {
        dispatch(loadUsers())
        dispatch(loadCreators())
        dispatch(push(`/admin/users/${user.user_id}`))
      }, 100)
      return user
    })
    .then(successNotification('User', 'created'))
    .catch(errorNotification('User', 'created'))
  }
})

export const updateUser = createAction('dftba/AUTH0_UPDATE_USER', payload => {
  return ({client, dispatch, getState})=> {
    let {users} = getState()
    return client.put(`/users/${payload.user_id}`, {
      body: payload
    }).then(x => {
      dispatch(loadUsers())
      dispatch(loadCreators())
      return x
    })
    .then(successNotification('User', 'updated'))
    .catch(errorNotification('User', 'updated'))
  }
})

export const removeUser = createAction('dftba/AUTH0_REMOVE_USER', payload => {
  return ({client, dispatch})=> {
    return client.del(`/users/${payload.user_id}`)
      .then(x => {
        dispatch(loadUsers())
        dispatch(loadCreators())
        return x
      })
      .then(successNotification('User', 'removed'))
      .catch(errorNotification('User', 'removed'))
  }
})

const initialState = {
  profile: null,
  token: null,
  selected: {},
  creators: [],
  list: []
}

export default handleActions({
  [loadToken]: (state, {payload}) => ({ ...state, token: payload }),
  [loadProfile]: (state, {payload}) => ({ ...state, profile: payload }),
  [login]: (state, {payload}) => ({ ...state, profile: payload.profile, token: payload.token }),
  [logout]: (state, {payload}) => ({ ...state, profile: null, token: null }),
  [loadCreators]: (state, {payload}) => ({ ...state, creators: payload }),
  [loadUsers]: (state, {payload}) => ({ ...state, list: payload }),
  [resetUser]: (state, action) => ({ ...state, selected: null }),
  [loadUser]: updateSelectedUser,
  [createUser]: updateSelectedUser,
  [updateUser]: updateSelectedUser
}, initialState)

function updateSelectedUser(state, {payload}) {
  let s = { ...state, selected: payload }
  if (payload.user_id === state.profile.user_id) {
    s.profile = payload
  }
  return s
}
