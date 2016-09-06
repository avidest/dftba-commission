import {createAction, handleActions} from 'protium'
import {successNotification, errorNotification} from './helpers/notifications'

import * as gridActions from './grid'

export const GRID_KEY = 'products'

export const addCommission = createAction('dftba/ADD_COMMISSION', payload => {
  return ({client, dispatch})=> {
    return client.post('/commissions', {
      body: payload
    }).then(resp => {
      dispatch(loadProduct(payload.product_id))
      return resp
    })
    .then(successNotification('Commission', 'created'))
    .catch(errorNotification('Commission', 'created'))
  }
})

export const updateCommission = createAction('dftba/UPDATE_COMMISSION', payload => {
  return ({client, dispatch, getState})=> {
    return client.put(`/commissions/${payload.id}`, {
      body: payload
    }).then(update => {
      dispatch(loadProduct(payload.product_id))
      return update
    })
    .then(successNotification('Commission', 'updated'))
    .catch(errorNotification('Commission', 'updated'))
  }
})

export const removeCommission = createAction('dftba/REMOVE_COMMISSION', payload => {
  return ({client, dispatch, getState})=> {
    return client.del(`/commissions/${payload.id}`).then(update => {
      dispatch(loadProduct(payload.product_id))
      return update
    })
    .then(successNotification('Commission', 'removed'))
    .catch(errorNotification('Commission', 'removed'))
  }
})

export const setProductsCount = createAction('dftba/SET_PRODUCTS_COUNT')

export const setPage = createAction('dftba/SET_PAGE', payload => {
  return ({dispatch, getState})=> {
    process.nextTick(x => dispatch(loadProducts()))
    return payload
  }
})

export const loadProductByCurrentUser = createAction('dftba/LOAD_PRODUCT_BY_USER', payload => {
  return ({client, getState})=> {
    let {users} = getState()
    return client.get(`/users/${users.profile.user_id}/products`)
  }
})

export const loadProducts = createAction('dftba/LOAD_PRODUCTS', (opts = {}) => {
  return ({client, getState, dispatch})=> {
    let query = {
      ...getState().products.queryOpts,
      ...opts,
      include: 'images'
    }
    return client.get('/products', {
      query,
      as: 'raw'
    }).then(resp => {
      let count = resp.headers.get('x-row-count')
      return resp.json().then(result => {
        return { result, count }
      })
    }).then(results => {
      console.log(results)
      dispatch(gridActions.loadAll({
        data: results.result,
        total: results.count
      }, GRID_KEY))
      return results
    })
  }
})

export const loadProduct = createAction('dftba/LOAD_PRODUCT', id => {
  return ({client})=> {
    return client.get(`/products/${id}`, {
      query: {
        include: 'images,variants,commissions'
      }
    })
  }
})

const initialState = {
  list: [],
  inventory: [],
  count: null,
  bulkSelections: [],
  bulkSelectAll: false,
  queryOpts: {
    page: 1,
    limit: 50
  },
  selected: null
}

export default handleActions({
  [loadProducts]: (state, {payload})=> ({
    ...state,
    list: payload.result,
    count: parseInt(payload.count, 10)
  }),
  [loadProductByCurrentUser]: (state, {payload})=> ({
    ...state,
    inventory: payload
  }),
  [loadProduct]: (state, {payload})=> ({
    ...state,
    selected: payload
  }),
  [setPage]: (state, {payload})=> ({
    ...state,
    queryOpts: {
      ...state.queryOpts,
      page: payload
    }
  })
}, initialState)