import React, {Component}       from 'react'
import {Helmet, asyncConnect}   from 'protium'
import AppHeader                from '../components/app-header'
import {logout, login}          from '../ducks/users'
import {loadSettings}           from '../ducks/settings'
import TransitionGroup          from 'react-addons-css-transition-group'
import {NotificationContainer}  from 'react-notifications';


const links = [
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.1/css/font-awesome.min.css' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Satisfy|Titillium+Web:400,400i,600,600i,700,700i|Yanone+Kaffeesatz:700' },
  { rel: 'stylesheet', href: `/assets/css/index.css` },
]

const meta = [
  { name: 'viewport', content: 'width=device-width,initial-scale=1' }
]

const deps = [{
  promise({store}) {
    return store.dispatch(loadSettings())
  }
}]

const mapStateToProps = state => ({
  token: state.users.token,
  profile: state.users.profile,
  loading: !state.reduxAsyncConnect.loaded,
  settings: state.settings
})

const mapDispatchToProps = {
  handleLogin: login,
  handleLogout: logout
}

@asyncConnect(deps, mapStateToProps, mapDispatchToProps)
export default class ApplicationView extends Component {  

  state = {
    ready: false
  }

  componentDidMount() {
    this.setState({ ready: true })
  }

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
          key: this.props.location.pathname,
          settings: this.props.settings,
          profile: this.props.profile
        })}
      </TransitionGroup>
      {this.state.ready && <NotificationContainer/>}
    </div>
  }
}
