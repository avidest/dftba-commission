import React, {Component}   from 'react'
import {Grid, Row, Col}     from 'react-bootstrap'
import PageHeader           from '../components/page-header'
import {connect}            from 'protium'
import {login}              from '../reducers/users'

@connect(state => ({ token: state.users.token }))
export default class LoginView extends Component {

  componentDidMount() {
    if (!this.props.token) {
      this.props.dispatch(login())
    }
  }

  render() {
    return <div>
      <PageHeader route={this.props.route} />
    </div>
  }
}