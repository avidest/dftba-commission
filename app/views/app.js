import React, {Component}       from 'react'
import {Helmet, connect}        from 'protium'
import AppHeader                from '../components/app-header'
import {logout, login}          from '../ducks/users'
import TransitionGroup          from 'react-addons-css-transition-group'

const links = [
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.1/css/font-awesome.min.css' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Satisfy|Titillium+Web:400,400i,600,600i,700,700i|Yanone+Kaffeesatz:700' },
  { rel: 'stylesheet', href: '/assets/styles.css' }
]

@connect(mapStateToProps, {
  handleLogin: login,
  handleLogout: logout
})
export default class ApplicationView extends Component {
  render() {
    return <div>
      <Helmet title="DFTBA Merchant Portal" link={links} />
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