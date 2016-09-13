import {
  handleActions,
  createAction as reduxCreateAction
} from 'protium'

export const init = createAction('dftba/grid/INIT')

export const reset = createAction('dftba/grid/RESET')

export const loadAll = createAction('dftba/grid/LOAD_ALL')

export const loadOne = createAction('dftba/grid/LOAD_ONE')

export const select = createAction('dftba/grid/SELECT')

export const selectAll = createAction('dftba/grid/SELECT_ALL')

export const setPage = createAction('dftba/grid/SET_PAGE')

export const setQuery = createAction('dftba/grid/SET_QUERY')

const initialState = {}

const storeDefaults = {
  data: [],
  selected: [],
  total: 0,
  limit: 50,
  page: 1,
  sort: [],
  query: void 0
}

const mutators = {
  init: reducer((state, action)=> ({
    ...storeDefaults
  })),
  populate: reducer((state, action)=> ({
    ...state,
    data: action.payload.data,
    total: action.payload.total
  })),
  selectAll: reducer((state, action)=> {
    let current = state.selected
    let selected = []
    if (current.length !== state.data.length) {
      var i = 0;
      while (i < state.data.length) {
        selected.push(i)
        i++
      }
    }
    return {
      ...state,
      selected
    }
  }),
  select: reducer((state, action)=> {
    var current = state.selected
    var contained = current.indexOf(action.payload)
    var selected = []
    if (contained > -1) {
      current.splice(contained, 1)
      selected = [...current]
    } else {
      selected = [...current, action.payload]
    }
    selected = selected.sort()
    return {
      ...state,
      selected
    }
  }),
  setPage: reducer((state, action)=> ({
    ...state,
    page: action.payload
  })),
  setQuery: reducer((state, action)=> ({
    ...state,
    selected: [],
    query: action.payload
  }))
}

export default handleActions({
  [init]: mutators.init,
  [reset]: mutators.init,
  [loadAll]: mutators.populate,
  [select]: mutators.select,
  [selectAll]: mutators.selectAll,
  [setPage]: mutators.setPage,
  [setQuery]: mutators.setQuery
}, initialState)

// Curries Action Creator-Creator to accept
// a second param, a state-key
function createAction(name, payloadCreator) {
  return reduxCreateAction(name, payloadCreator, (payload, key)=> {
    return { stateKey: key }
  })
}

// Creates a specialized reducer that will pull out
// and apply a payload to a specific state slice (based on state-key).
function reducer(reduce) {
  return (state, action)=> {
    let key = action.meta.stateKey
    let slice = state[key]
    let newState = reduce(slice, action)
    return { ...state, [key]: newState }
  }
}
