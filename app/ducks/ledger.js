import {createAction, handleActions} from 'protium'
import find from 'lodash/find'
import {replace} from 'protium/router'
import moment from 'moment'

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
    let location = getState().routing.locationBeforeTransitions
    let query = Object.keys(payload).length ? {
      startDate: moment.isMoment(payload.startDate) ? payload.startDate.toISOString() : payload.startDate,
      endDate: moment.isMoment(payload.endDate) ? payload.endDate.toISOString() : payload.endDate
    } : {}

    return client.get('users/creators/transactions/summaries', {
      query
    }).then(x => {
      if (query.endDate !== location.query.endDate || query.startDate !== location.query.startDate) {
        dispatch(replace({ pathname: location.pathname, query }))
      }
      return x
    })
  }
})

export const loadTransactionsByUser = createAction('dftba/ledger/LOAD_TRANSACTIONS_BY_USER', payload => {
  return ({client, getState, dispatch})=> {
    let location = getState().routing.locationBeforeTransitions
    let query = Object.keys(payload).length ? {
      startDate: moment.isMoment(payload.startDate) ? payload.startDate.toISOString() : payload.startDate,
      endDate: moment.isMoment(payload.endDate) ? payload.endDate.toISOString() : payload.endDate
    } : {}

    if (payload.kind) {
      query.kind = payload.kind
    }

    return client.get(`users/${payload.user_id}/transactions`, {
      query
    })
  }
})

export const loadSummariesByUser = createAction('dftba/ledger/LOAD_TRANSACTIONS_SUMMARIES_BY_USER', payload => {
  return ({client, getState, dispatch})=> {
    let location = getState().routing.locationBeforeTransitions
    let query = Object.keys(payload).length ? {
      startDate: moment.isMoment(payload.startDate) ? payload.startDate.toISOString() : payload.startDate,
      endDate: moment.isMoment(payload.endDate) ? payload.endDate.toISOString() : payload.endDate
    } : {}

    if (payload.kind) {
      query.kind = payload.kind
    }

    return client.get(`users/${payload.user_id}/transactions/summary`, {
      query
    }).then(x => {
      if (query.endDate !== location.query.endDate || query.startDate !== location.query.startDate) {
        dispatch(replace({ pathname: location.pathname, query }))
      }
      return x
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