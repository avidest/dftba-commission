
const initialState = {
  me: null,
  selected: {},
  list: [
    {id: 1, name: 'Kat Gritzmacher', role: 'admin', email: 'kat@3five.com'},
    {id: 2, name: 'Jon Jaques', role: 'admin', email: 'jon@3five.com'},
    {id: 3, name: 'Dave Loos', role: 'admin', email: 'dave@dftba.com'},
    {id: 4, name: 'Random Guy', role: 'merchant', email: 'some@guy.com'},
  ]
}

export default function usersReducer(state = initialState, action) {
  return state;
}