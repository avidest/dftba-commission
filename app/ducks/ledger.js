import {createAction, handleActions} from 'protium'
import find from 'lodash/find'
import {replace} from 'protium/router'
import moment from 'moment'
import {getCurrentCycle} from '../../lib/cycle'

export const createTransaction = createAction('dftba/ledger/CREATE_TRANSACTION', payload => {
  return ({client, dispatch})=> {

    payload.amount = parseFloat(payload.amount)

    if (payload.kind === 'debit' && payload.amount >= 0) {
      payload.amount = -1 * payload.amount
    }

    return client.post('transactions', {
      data: payload
    }).then(transaction => {
      dispatch(loadSummaries())
      return transaction
    })
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

    console.log(startDate, endDate)
    startDate = startDate.toISOString()
    endDate = endDate.toISOString()

    return client.get('users/creators/transactions/summaries', { 
      query: {startDate, endDate}
    })
  }
})

export const loadTransactionsByUser = createAction('dftba/ledger/LOAD_TRANSACTIONS_BY_USER', payload => {
  return ({client, getState, dispatch})=> {
    let {settings} = getState()
    let currentCycle = getCurrentCycle(settings)
    console.log('loadTransactionsByUser', payload)
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
      query: {startDate, endDate}
    })
  }
})

export const loadSummariesByUser = createAction('dftba/ledger/LOAD_TRANSACTIONS_SUMMARIES_BY_USER', payload => {
  return ({client, getState, dispatch})=> {
    let {settings} = getState()
    let currentCycle = getCurrentCycle(settings)
console.log('loadSummariesByUser', payload)
    
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
  [loadSummaries]: (state, {payload})=> ({ ...state, summaries: payload }),
  [loadSummariesByUser]: (state, {payload})=> ({ ...state, selectedSummary: payload }),
  [loadTransactionsByUser]: (state, {payload})=> ({ ...state, selectedTransactions: payload })
}, initialState)