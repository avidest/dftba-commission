export default function errorReporter(store) {
  return next => action => {
    if (action.error) {
      if (action.payload instanceof Response
        && !action.payload.bodyUsed
        && action.payload.json
      ) {
        action.payload.json()
          .then(resp => console.log(resp))
      }
    }
    return next(action)
  }
}