
const initialState = {
  me: null,
  selected: {},
  list: [
    {name: 'Kat Gritzmacher', role: 'admin', email: 'kat@3five.com'},
    {name: 'Jon Jaques', role: 'admin', email: 'jon@3five.com'},
    {name: 'Dave Loos', role: 'admin', email: 'dave@dftba.com'},
    {name: 'Random Guy', role: 'merchant', email: 'some@guy.com'},
  ]
}

export default function usersReducer(state = initialState, action) {
  return state;
}