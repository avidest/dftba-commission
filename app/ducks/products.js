import {createAction, handleActions} from 'protium'

export const addCommission = createAction('dftba/ADD_COMMISSION', payload => {
  return ({client})=> {
    return client.post('/commissions', {
      body: payload
    })
  }
})

export const setProductsCount = createAction('dftba/SET_PRODUCTS_COUNT')

export const loadProducts = createAction('dftba/LOAD_PRODUCTS', opts => {
  return ({client, dispatch})=> {
    return client.get('/products', {
      query: {
        include: 'images,variants'
      },
      as: 'raw'
    }).then(resp => {
      let count = resp.headers.get('x-row-count')
      if (count) {
        dispatch(setProductsCount(parseInt(count, 10)))
      }
      return resp.json()
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
  selected: null
}

export default handleActions({
  [setProductsCount]: (state, {payload})=> ({
    ...state,
    count: payload
  }),
  [loadProducts]: (state, {payload})=> ({
    ...state,
    list: payload
  }),
  [loadProduct]: (state, {payload})=> ({
    ...state,
    selected: payload
  })
}, initialState)