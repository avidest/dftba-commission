import {createAction, handleActions} from 'protium'

export const addCommission = createAction('dftba/ADD_COMMISSION', payload => {
  return ({client, dispatch})=> {
    return client.post('/commissions', {
      body: payload
    }).then(resp => {
      dispatch(loadProduct(payload.product_id))
      return resp
    })
  }
})

export const setProductsCount = createAction('dftba/SET_PRODUCTS_COUNT')

export const loadProducts = createAction('dftba/LOAD_PRODUCTS', (opts = {}) => {
  let query = {
    ...opts,
    include: 'images'
  }
  return ({client})=> {
    return client.get('/products', {
      query,
      as: 'raw'
    }).then(resp => {
      let count = resp.headers.get('x-row-count')
      return resp.json().then(result => {
        return { result, count }
      })
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
  count: null,
  bulkSelections: [],
  bulkSelectAll: false,
  queryOpts: {},
  selected: null
}

export default handleActions({
  [loadProducts]: (state, {payload})=> ({
    ...state,
    list: payload.result,
    count: payload.count
  }),
  [loadProduct]: (state, {payload})=> ({
    ...state,
    selected: payload
  })
}, initialState)