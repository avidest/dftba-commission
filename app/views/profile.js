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
      console.log('fly')
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
  handleSave() {
    return this.refs.usersDetailForm.submit()
  }

  handleSubmit(payload) {
    return this.props.updateUser(payload)
  }

  render() {
    console.log(this.props)
    return <div>
      <PageHeader title={this.props.routes[this.props.routes.length-1].title}>
        <ButtonGroup className="pull-right">
          <LinkContainer to="/">
            <Button bsSize="lg">Back</Button>
          </LinkContainer>
          <Button bsSize="lg" bsStyle="primary" onClick={::this.handleSave}>
            Save
          </Button>
        </ButtonGroup>
      </PageHeader>
      <Grid>
        <Row>
          <Col xs={12}>
            <UsersDetailForm profile ref="usersDetailForm" onSubmit={::this.handleSubmit} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}
