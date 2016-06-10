import React from 'react'
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
  Redirect
} from 'protium/router'

import Application from './views/app'
import Dashboard from './views/dashboard'
import Splash from './views/splash'
import NotFound from './views/notfound'

export default new Router({
  routes: [
    <Route path="/" component={Application} >
      <IndexRoute component={Splash} />
      <Route path="dashboard" component={Dashboard} onEnter={authenticate('admin')} />
      <Route path="admin" component={Dashboard} onEnter={authenticate('admin')} />
      <Route path="*" component={NotFound} notFound={true} />
    </Route>
  ]
})

function authenticate(role) {
  return (nextProps, replace)=> {
    console.log(nextProps)
    return nextProps
  }
}