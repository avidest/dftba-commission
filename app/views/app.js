import React, {Component}       from 'react'
import {Helmet, connect}        from 'protium'
import AppHeader                from '../components/app-header'
import {logout, login}          from '../ducks/users'
import TransitionGroup          from 'react-addons-css-transition-group'

const links = [
  { rel: 'stylesheet', href: '/assets/styles.css' }
]

const meta = [
  { name: 'viewport', content: 'width=device-width,initial-scale=1' }
]

@connect(mapStateToProps, {
  handleLogin: login,
  handleLogout: logout
})
export default class ApplicationView extends Component {
  render() {
    return <div>
      <Helmet title="DFTBA Creator Portal" link={links} meta={meta} />
      <AppHeader {...this.props} />
      <TransitionGroup
        id="content"
        component="div"
        transitionName="fade"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname
        })}
      </TransitionGroup>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    token: state.users.token,
    profile: state.users.profile,
    loading: !state.reduxAsyncConnect.loaded
  }
}