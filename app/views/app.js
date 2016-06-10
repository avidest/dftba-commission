import React, {Component} from 'react'
import {Helmet} from 'protium'


const links = [
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css' },
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.1/css/font-awesome.min.css' }
]

export default class Application extends Component {
  render() {
    return <div>
      <Helmet title="DFTBA Merchant Portal" link={links} />
      <h1>DFTBA Merchant Portal</h1>
      <div>
      {this.props.children}
      </div>
    </div>
  }
}