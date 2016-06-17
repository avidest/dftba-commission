import React, {Component} from 'react'
import {Helmet}   from 'protium'
import AppHeader  from '../components/app-header'
import {Grid}     from 'react-bootstrap'

const links = [
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.1/css/font-awesome.min.css' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Satisfy|Titillium+Web:400,400i,600,600i,700,700i|Yanone+Kaffeesatz:700' },
  { rel: 'stylesheet', href: '/assets/styles.css' }
]

export default class ApplicationView extends Component {
  render() {
    return <div>
      <Helmet title="DFTBA Merchant Portal" link={links} />
      <AppHeader route={this.props.route.childRoutes[0]} />
      <div id="content">{this.props.children}</div>
    </div>
  }
}