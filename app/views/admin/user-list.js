import React, {Component} from 'react'
import {connect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import UsersList from '../../components/user-list'

@connect(state => ({users: state.users.list}))
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
            <UsersList users={this.props.users} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}