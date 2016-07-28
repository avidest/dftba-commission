import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import UsersList from '../../components/user-list'
import {loadUsers, removeUser} from '../../ducks/users'

const dataDeps = [
  {
    promise: function({store}) {
      let promises = []
      let {users} = store.getState()
      if (users.list && !users.list.length) {
        promises.push(store.dispatch(loadUsers()))
      }
      return Promise.all(promises)
    }
  }
]

const mapState = (state)=> ({ users: state.users.list })

const mapDispatch = {
  handleRemove: removeUser
}

@asyncConnect(dataDeps, mapState, mapDispatch)
export default class UserListView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route}>
        <ButtonGroup className="pull-right">
          <LinkContainer to="/admin/users/create">
            <Button bsSize="lg">Add User</Button>
          </LinkContainer>
        </ButtonGroup>
      </PageHeader>
      <Grid>
        <Row>
          <Col xs={12}>
            <UsersList {...this.props} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}