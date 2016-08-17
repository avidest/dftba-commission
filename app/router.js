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
import UserProfile        from './views/profile'
import OrderList          from './views/admin/order-list'
import OrderDetail        from './views/admin/order-detail'
import ProductList        from './views/admin/product-list'
import ProductDetail      from './views/admin/product-detail'
import ProductDetailCommissionDetail from './views/admin/product-detail-edit-commission'

export default new Router({
  routes: store => {
    let {users} = store.getState()
    return <Route path="/" component={Application}>
      <IndexRoute title="Welcome" component={Index} />
      <Route path="profile"
             title="User Profile"
             component={UserProfile} />
      <Route path="admin">
        <IndexRoute                 title="Admin Dashboard"   component={AdminDashboard} />
        <Route path="ledger"             title="Ledger"             component={OrderList} />
        <Route path="ledger/user/:id"    title="Ledger Details"     component={OrderDetail} />
        <Route path="users"         title="Users"             component={UserList} />
        <Route path="users/:id"     title="User Details"      component={UserDetail} />
        <Route path="products"      title="Products"          component={ProductList} />
        <Route path="products/:id"  title="Product Details"   component={ProductDetail}>
          <Route path="commissions/:commission_id" title="Commission Details" component={ProductDetailCommissionDetail} />
        </Route>
      </Route>
      <Route path="creators">
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

    // if (url !== '/' && !loggedIn) {
    //   return replace('/')
    // }
    //
    // if (url === '/' || roleDefined && !matchesRole) {
    //   if (url !== defaultView) {
    //     return replace(defaultView)
    //   }
    // }
  }
}