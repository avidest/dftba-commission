import React from 'react'
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
  Redirect
} from 'protium/router'

// Shared views
import Application        from './views/app'
import Index              from './views/index'
import UserProfile        from './views/profile'
import NotFound           from './views/notfound'

// Admin view
import UserList                         from './views/admin/user-list'
import UserDetail                       from './views/admin/user-detail'
import LedgerList                       from './views/admin/ledger-list'
import LedgerDetail                     from './views/admin/ledger-detail'
import ProductList                      from './views/admin/product-list'
import ProductDetail                    from './views/admin/product-detail'
import ProductDetailCommissionDetail    from './views/admin/product-detail-edit-commission'
import AddTransactionModal              from './views/admin/add-transaction-modal'
import Settings                         from './views/admin/settings'

// Creator views
import CreatorsDashboard                from './views/creator/dashboard'
import CreatorInventory                 from './views/creator/inventory'
import CreatorExpenses                  from './views/creator/expenses'
import CreatorIncome                    from './views/creator/income'


export default new Router({
  routes: store => {
    return <Route path="/" component={Application}>
      <IndexRoute title="Welcome" component={Index} />
      <Route path="profile" title="User Profile" component={UserProfile} />
      <Route path="admin" onEnter={authenticate(store)}>
        <IndexRedirect to="ledger" />
        <Route path="ledger"        title="Ledger"            component={LedgerList}>
          <Route path="transaction" title="Add Transaction"   component={AddTransactionModal} />
        </Route>
        <Route path="ledger/:user_id"    title="Ledger Details"     component={LedgerDetail} />
        <Route path="users"         title="Users"             component={UserList} />
        <Route path="users/:id"     title="User Details"      component={UserDetail} />
        <Route path="products"      title="Products"          component={ProductList} />
        <Route path="products/:id"  title="Product Details"   component={ProductDetail}>
          <Route path="commissions/:commission_id" title="Commission Details" component={ProductDetailCommissionDetail} />
        </Route>
        <Route path="settings"      title="Settings"          component={Settings} />
      </Route>
      <Route path="creator" onEnter={authenticate(store)}>
        <IndexRoute               title="Creator Dashboard"    component={CreatorsDashboard}  />
        <Route path="inventory"   title="My Inventory"         component={CreatorInventory} />
        <Route path="expenses"    title="Expenses"             component={CreatorExpenses} />
        <Route path="income"      title="Income"               component={CreatorIncome} />
      </Route>
      <Route path="*" title="Not Found" component={NotFound} notFound={true} />
    </Route>
  }
})

function authenticate(store) {
  return (nextProps, replace)=> {
    let {users: {token, profile}} = store.getState()
    let url = nextProps.location.pathname
    let loggedIn = !!(token && profile)
    let role = profile.app_metadata && profile.app_metadata.role
    if ((!loggedIn || !role) && url !== '/') {
      return replace('/')
    }

    if (url === '/profile') {
      return
    }

    if (role !== 'admin' && url.indexOf('/admin') === 0) {
      return replace('/')
    }

    if (role !== 'creator' && url.indexOf('/creator') === 0) {
      return replace('/')
    }
  }
}