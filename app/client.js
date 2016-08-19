import 'babel-polyfill'
import app from './index'

global.__STATE__.routing = {}

app.render()

if (module.hot) {
  module.hot.accept('./index', ()=> {
    console.log('Rendering hot update...')
    require('./index').default.render()
  })
}

export default app