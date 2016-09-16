import React, {Component}   from 'react'
import {Grid, Row, Col, Button}     from 'react-bootstrap'
import {connect}            from 'protium'
import {Link, LinkContainer} from 'protium/router'
import {login}              from '../ducks/users'
import PageHeader           from '../components/page-header'

@connect(state => ({ token: state.users.token }), { login })
export default class HomeView extends Component {

  componentDidMount() {
    this.props.login()
  }

  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <div id="login-container" style={{width: '300px', margin: '0 auto'}} />
    </div>
  }
}