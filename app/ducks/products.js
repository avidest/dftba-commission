import {createAction, handleActions} from 'protium'
import {successNotification, errorNotification} from './helpers/notifications'
import {calcCommission} from '../../lib/transactions'
import {getCurrentCycle} from '../../lib/cycle'
import moment from 'moment'
import find from 'lodash/find'

import * as gridActions from './grid'

export const GRID_KEY = 'products'

export const loadInventorySalesByUser = createAction('dftba/LOAD_SALES_BY_USER', payload => {
  return ({client, getState, dispatch})=> {
    let {settings, users} = getState()
    let currentCycle = getCurrentCycle(settings)

    let {startDate, endDate, user_id} = payload

    if (!startDate) {
      startDate = currentCycle.start
    }

    if (!endDate) {
      endDate = currentCycle.end
    }

    startDate = startDate.toISOString()
    endDate = endDate.toISOString()

    return client.get(`users/${user_id}/transactions/sales-summary`, {
      query: {startDate, endDate}
    })
  }
})

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
    let state = getState()

    let {
      withGrid,
      ...queryOpts
    } = opts

    let query = withGrid 
      ? getGridQuery(state, GRID_KEY) 
      : {
      ...state.products.queryOpts,
      ...queryOpts
    }

    query.include = 'images'

    return client.get('/products', {
      query,
      as: 'raw'
    }).then(resp => {
      let count = parseInt(resp.headers.get('x-row-count'), 10)
      return resp.json().then(result => {
        return { result, count }
      })
    }).then(results => {
      let grid = getState().grid[GRID_KEY]
      if (!grid.query || !grid.query.length || grid.query === query.query) {
        dispatch(gridActions.loadAll({
          data: results.result,
          total: results.count
        }, GRID_KEY))
      }
      return results
    })
  }
})

function getGridQuery(state, key) {
  let grid = state.grid[key]
  let query = {
    page: grid.page,
    limit: grid.limit,
    sort: grid.sort
  }

  if (grid.query && grid.query.length) {
    query.query = grid.query;
    query.fields = 'title,vendor,handle'
  }

  return query;
}

export const loadProduct = createAction('dftba/LOAD_PRODUCT', id => {
  return ({client})=> {
    return client.get(`/products/${id}`, {
      query: {
        include: 'images,variants,commissions'
      }
    })
  }
})


const exportMap = {
  'title': 'Product Title',
  'published': 'Published',
  'price': 'Price',
  'commission': 'Potential Commission',
  'inventory': 'Inventory on Hand'
}
const exportColOrder = [
  'title',
  'published',
  'price',
  'commission',
  'inventory',
]

export const exportCSV = createAction('dftba/EXPORT_CSV', payload => {
  return ({getState})=> {
    let state = getState()
    let {inventory} = state.products
    let csvData = []
    let csvText = 'data:text/csv;charset=utf-8,'
    if (!inventory.length) {
      return alert('No inventory to export!')
    }

    csvData.push([
      'Title',
      'Published',
      'Price',
      'Potential Commission',
      'Inventory on Hand'
    ])

    for (let product of inventory) {
      for (let variant of product.variants) {
        variant.commission = product.commissions[0]
        csvData.push([
          `${product.title} ${variant.title === 'Default Title' ? '' : ('/ ' + variant.title)}`,
          product.published_at ? 'TRUE' : 'FALSE',
          '$' + variant.price,
          '$' + calcCommission(variant.price, variant.commission),
          variant.inventory_quantity
        ])
      }
    }

    csvData.forEach((row, index)=> {
      let data = row.map(c => JSON.stringify(c)).join(',')
      csvText += index < csvData.length ? `${data}\n` : data
    })

    let encodedUri = encodeURI(csvText)
    let link = document.createElement('a')
    let cycleEnd
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `dftba-inventory-export-${moment().format('lll')}.csv`);
    document.body.appendChild(link) // Required for FF
    link.click()
    link.remove()
  }
})

const initialState = {
  list: [],
  inventory: [],
  sales: {},
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
  }),
  [loadInventorySalesByUser]: (state, {payload})=> ({
    ...state,
    sales: payload
  })
}, initialState)