import React from 'react'
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
  Redirect
} from 'protium/router'

import Application        from './views/app'
import Index              from './views/index'
import AdminDashboard     from './views/admin/dashboard'
import CreatorsDashboard  from './views/creators/dashboard'
import NotFound           from './views/notfound'

import UserList           from './views/admin/user-list'
import UserDetail         from './views/admin/user-detail'
import OrderList          from './views/admin/order-list'
import OrderDetail        from './views/admin/order-detail'
import ProductList        from './views/admin/product-list'
import ProductDetail      from './views/admin/product-detail'

export default new Router({
  routes: store => {
    return <Route path="/" component={Application}>
      <IndexRoute title="Welcome" component={Index} onEnter={authenticate(store)} />
      <Route path="/admin" onEnter={authenticate(store, 'admin')}>
        <IndexRoute                 title="Admin Dashboard"   component={AdminDashboard} />
        <Route path="orders"        title="Orders"            component={OrderList} />
        <Route path="orders/:id"    title="Order Details"     component={OrderDetail} />
        <Route path="users"         title="Users"             component={UserList} />
        <Route path="users/:id"     title="User Details"      component={UserDetail} />
        <Route path="products"      title="Products"          component={ProductList} />
        <Route path="products/:id"  title="Product Details"   component={ProductDetail} />
      </Route>
      <Route path="/creators" onEnter={authenticate(store, 'creator')}>
        <IndexRoute title="Creator Dashboard" component={CreatorsDashboard}  />
      </Route>
      <Route path="*" title="Not Found" component={NotFound} notFound={true} />
    </Route>
  }
})

function authenticate(store, role) {
  return (nextProps, replace)=> {
    let {users} = store.getState()
    let url = nextProps.location.pathname
    let loggedIn = !!(users.token && users.profile)
    let roleDefined = !!role
    let matchesRole = users.profile && users.profile.role === role
    let defaultView = loggedIn
      ? users.profile.role === 'admin' ? '/admin' : '/creators'
      : '/'

    if (url !== '/' && !loggedIn) {
      return replace('/')  
    }

    if (url === '/' || roleDefined && !matchesRole) {
      if (url !== defaultView) {
        return replace(defaultView)
      }
    }
  }
}