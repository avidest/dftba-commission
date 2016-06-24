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
import UsersDetail from './views/users-detail'
import UsersList from './views/users-list'
import Login from './views/login'
import NotFound from './views/notfound'

export default new Router({
  routes: [
    <Route path="/" component={Application} >
      <IndexRoute title="Login" component={Login} />
      <Route onEnter={authenticate('admin')}>
        <Route path="users" title="Users" component={UsersList} onEnter={authenticate('admin')} />
        <Route path="users/:id" title="Edit User" component={UsersDetail} onEnter={authenticate('admin')} />
      </Route>
      <Route onEnter={authenticate()}>
        <Route path="dashboard" title="Dashboard" component={Dashboard}  />
      </Route>
      <Route path="*" title="Not Found" component={NotFound} notFound={true} />
    </Route>
  ]
})

function authenticate(role) {
  return (nextProps, replace)=> {
    // console.log(nextPr ops)
    return nextProps
  }
}