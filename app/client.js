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

const errorMsg = `
An error within the app has occurred. We're going to try reloading the page. 
Please contact your administrator if this message persists.
If you don't want to reload you can click cancel.
`

global.onerror = function() {
	if (confirm(errorMsg)) {
		location.reload()
	}
}

export default app