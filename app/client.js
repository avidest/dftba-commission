import 'babel-polyfill'
import app from './index'

app.render()

if (module.hot) {
  module.hot.accept('./index', ()=> {
    require('./index').default.render()
  })
}