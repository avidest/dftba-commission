import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import UsersDetailForm from '../../forms/user-detail'
import {
  loadUser,
  createUser,
  updateUser,
  removeUser
} from '../../ducks/users'

const deps = [
  {
    promise: ({store, params})=> {
      let promises = []
      let {users} = store.getState()
      let hasIdAndNotCreate = params.id && params.id.length && params.id !== 'create'
      if (hasIdAndNotCreate && !users.selected || hasIdAndNotCreate && users.selected.id != params.id) {
        promises.push(store.dispatch(loadUser(params)))
      }
      return Promise.all(promises)
    }
  }
]

@asyncConnect(deps, null, { createUser, updateUser, removeUser })
export default class UserDetailView extends Component {
  handleSave() {
    return this.refs.usersDetailForm.submit()
  }

  handleSubmit(payload) {
    if (this.props.params.id === 'create') {
      return this.props.createUser(payload)
    }
    return this.props.updateUser(payload)
  }

  getTitle() {
    return this.props.params.id.toLowerCase() === 'create' ? 'Create User' : 'Edit User'
  }

  render() {
    return <div>
      <PageHeader title={this.getTitle()}>
        <ButtonGroup className="pull-right">
          <LinkContainer to="/admin/users">
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
            <UsersDetailForm ref="usersDetailForm" 
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
