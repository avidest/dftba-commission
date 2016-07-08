import React, {Component}   from 'react'
import {Grid, Row, Col}     from 'react-bootstrap'
import PageHeader           from '../components/page-header'
import {connect}            from 'protium'
import {login}              from '../reducers/users'

export default class SplashView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route} />
    </div>
  }
}