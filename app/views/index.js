import React, {Component}    				from 'react'
import {Grid, Row, Col, Button}     from 'react-bootstrap'
import {connect}             				from 'protium'
import {Link, LinkContainer, push} 	from 'protium/router'
import {login}               				from '../ducks/users'
import PageHeader            				from '../components/page-header'

const mapStateToProps = state => ({ 
	token: state.users.token, 
	profile: state.users.profile 
})

@connect(mapStateToProps, { login, push })
export default class HomeView extends Component {

  componentDidMount() {
		if (this.props.profile) {
			let profile = this.props.profile
			if (profile.app_metadata && profile.app_metadata.role === 'admin') {
				this.props.push('/admin')
			} else {
				this.props.push('/creator')
			}
		} else {
    	this.props.login()
		}
  }

  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <div id="login-container" style={{width: '300px', margin: '0 auto'}} />
    </div>
  }
}