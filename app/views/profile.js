import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../components/page-header'
import UsersDetailForm from '../forms/user-detail'
import { loadUser, updateUser } from '../ducks/users'

const deps = [
  {
    promise: ({store, params})=> {
      let promises = []
      let {users} = store.getState()
      if (users.profile && users.profile.user_id) {
        promises.push(store.dispatch(loadUser(users.profile)))
      }
      return Promise.all(promises)
    }
  }
]

@asyncConnect(deps, null, { updateUser })
export default class ProfileView extends Component {
  handleSubmit(payload) {
    return this.props.updateUser(payload)
  }

  render() {
    return <div>
      <PageHeader title={this.props.routes[this.props.routes.length-1].title} />
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <UsersDetailForm
              profile
              ref="usersDetailForm"
              onSubmit={::this.handleSubmit}
              params={this.props.params}
              location={this.props.location}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}
