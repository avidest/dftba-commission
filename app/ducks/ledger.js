import {createAction, handleActions} from 'protium'
import find from 'lodash/find'

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

export const loadSummaries = createAction('dftba/ledger/LOAD_TRANSACTIONS', payload => {
  return ({client, getState})=> {
    return client.get('users/creators/transactions/summaries')
  }
})


const initialState = {
  summaries: []
}

export default handleActions({
  [loadSummaries]: (state, {payload})=> ({ ...state, summaries: payload })
}, initialState)