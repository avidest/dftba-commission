import {createAction, handleActions} from 'protium'

export const loadTransactions = createAction('dftba/ledger/LOAD_TRANSACTIONS', payload => {
  return ({client})=> {
    return client.get('transactions', {
      query: {
        page: 1,
        limit: 500,
        include: 'user,line_item'
      }
    })
  }
})


const initialState = { 
  transactions: [] 
}

export default handleActions({
  [loadTransactions]: (state, {payload})=> ({ ...state, transactions: payload })
}, initialState)