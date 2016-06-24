import React, {Component}   from 'react'
import {Grid, Row, Col}     from 'react-bootstrap'
import PageHeader           from '../components/page-header'
import {connect}            from 'protium'
import {login}              from '../reducers/users'

@connect(mapPropsToState, {
  login: login
})
export default class SplashView extends Component {
  componentDidMount() {
    if (!this.props.me) {
      this.props.login()
    }
  }

  render() {
    return <div>
      <PageHeader route={this.props.route} />
    </div>
  }
}

function mapPropsToState(state) {
  return {
    me: state.users.me
  }
}