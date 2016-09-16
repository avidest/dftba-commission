import {createAction, handleActions} from 'protium'
import {replace} from 'protium/router'
import {getCurrentCycle} from '../../lib/cycle'
import * as gridActions from './grid'
import get from 'lodash/get'
import moment from 'moment'
import {
  successNotification,
  errorNotification
} from './helpers/notifications'

export const GRID_KEY = 'ledger'

export const createTransaction = createAction('dftba/ledger/CREATE_TRANSACTION', payload => {
  return ({client, dispatch})=> {

    payload.amount = parseFloat(payload.amount)

    if (payload.kind === 'debit' && payload.amount >= 0) {
      payload.amount = -1 * payload.amount
    }

    return client.post('transactions', {
      data: payload
    }).then(transaction => {
      dispatch(loadSummaries({ withGrid: true }))
      return transaction
    })
      .then(successNotification('Transaction', 'created'))
      .catch(errorNotification('Transaction', 'created'))
  }
})

export const bulkPayout = createAction('dftba/ledger/BULK_PAYOUT', payload => {
  let data = Array.isArray(payload) ? payload : []
  return ({client, dispatch})=> {
    let promises = []

    for (let datum of data) {
      datum.netBalance = parseFloat(datum.netBalance)

      let ending = moment(datum.cycleEnd)

      if (datum.netBalance > 0) {
        promises.push(client.post('transactions', {
          data: {
            amount: datum.netBalance * -1,
            created_at: ending.subtract(1, 'second').toJSON(),
            description: `Payout for cycle ending ${ending.format('ll')}`,
            kind: 'debit',
            payout: true,
            user_id: datum.user_id
          }
        }))
      }
    }

    return Promise.all(promises)
      .then(x => {
        dispatch(loadSummaries({ withGrid: true }))
        return x
      })
      .then(successNotification('Bulk Payout', 'completed'))
      .catch(errorNotification('Bulk Payout', 'to complete'))
  }
})


const exportMap = {
  'cycleEnd': 'Cycle End',
  'cycleStart': 'Cycle Start',
  'grossCredits': 'Gross Income',
  'grossDebits': 'Gross Expenses',
  'netBalance': 'Net Payout',
  'startingBalance': 'Starting Balance',
  'user.name': 'Creator Name'
}
const exportColOrder = [
  'user.name',
  'startingBalance',
  'grossCredits',
  'grossDebits',
  'netBalance',
  'cycleStart',
  'cycleEnd',
]

export const bulkExport = createAction('dftba/ledger/BULK_EXPORT', payload => {
  let csvData = []
  let csvText = 'data:text/csv;charset=utf-8,'
  let data = Array.isArray(payload) ? payload : []
  if (data.length) {
    var headerRow = exportColOrder.map(key => exportMap[key])

    csvData.push(headerRow)

    var dataRows = data.map(datum => {
      return exportColOrder.map(key => {
        let val = get(datum, key)
        if (key === 'cycleStart' || key === 'cycleEnd') {
          val = moment(val).format('lll Z')
        }
        return val
      })
    })
    if (!dataRows.length) {
      return;
    }

    csvData = csvData.concat(dataRows)

    csvData.forEach((row, index)=> {
      let data = row.map(c => JSON.stringify(c)).join(',')
      csvText += index < csvData.length ? `${data}\n` : data
    })

    let encodedUri = encodeURI(csvText)
    let link = document.createElement('a')
    let cycleEnd
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `dftba-commission-export-${moment().format('lll')}.csv`);
    document.body.appendChild(link) // Required for FF
    link.click()
    link.remove()
  }
})

export const loadSummaries = createAction('dftba/ledger/LOAD_SUMMARIES', (payload = {}) => {
  return ({client, getState, dispatch})=> {
    let {settings} = getState()
    let currentCycle = getCurrentCycle(settings)

    let {startDate, endDate} = payload

    if (!startDate) {
      startDate = currentCycle.start
    }

    if (!endDate) {
      endDate = currentCycle.end
    }

    startDate = startDate.toISOString()
    endDate = endDate.toISOString()

    return client.get('users/creators/transactions/summaries', { 
      query: {startDate, endDate}
    }).then(summaries => {
      if (!summaries) { summaries = [] }
      let grid = getState().grid[GRID_KEY]
      if (!grid.query || !grid.query.length || grid.query === query.query) {
        dispatch(gridActions.loadAll({
          data: summaries,
          total: summaries.length
        }, GRID_KEY))
      }
      return summaries
    })
  }
})

export const loadTransactionsByUser = createAction('dftba/ledger/LOAD_TRANSACTIONS_BY_USER', payload => {
  return ({client, getState, dispatch})=> {
    let {settings} = getState()
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

    return client.get(`users/${user_id}/transactions`, { 
      query: {startDate, endDate, sort: '-created_at'}
    })
  }
})

export const loadSummariesByUser = createAction('dftba/ledger/LOAD_TRANSACTIONS_SUMMARIES_BY_USER', payload => {
  return ({client, getState, dispatch})=> {
    let {settings} = getState()
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


    return client.get(`users/${user_id}/transactions/summary`, {
      query: {startDate, endDate}
    })
  }
})


const initialState = {
  summaries: [],
  selectedSummary: null,
  selectedTransactions: []
}

export default handleActions({
  [loadSummaries]: (state, {payload})=> ({ ...state, summaries: (payload || []) }),
  [loadSummariesByUser]: (state, {payload})=> ({ ...state, selectedSummary: payload }),
  [loadTransactionsByUser]: (state, {payload})=> ({ ...state, selectedTransactions: payload })
}, initialState)