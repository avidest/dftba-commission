import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Well,
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap'

export default class UserList extends Component {
  isSameUser(user) {
    return user.user_id === this.props.current_user.user_id
  }

  handleRemove(e) {
    e.preventDefault()
    if (confirm('Are you sure you wish to delete this user?')) {
      this.props.handleRemove({ user_id: e.target.dataset.userid })
    }
  }

  render() {
    if (!this.props.users && !this.props.users.length) {
      return <Well>
        No users yet!
      </Well>
    }
    var style = {verticalAlign: 'middle'}
    return <Table hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Activated</th>
          <th>Role</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {this.props.users.map(user => {
          return <tr key={user.user_id}>
            <td style={style}>{user.user_metadata && user.user_metadata.name}</td>
            <td style={style}>{user.email}</td>
            <td style={style}>{user.email_verified ? 'Yes' : 'No'}</td>
            <td style={style}>{(user.app_metadata && user.app_metadata.role) || 'creator'}</td>
            <td style={style} className="text-right">
              <ButtonGroup>
                <LinkContainer to={`/admin/users/${user.user_id}`}>
                  <Button bsSize="sm">Edit</Button>
                </LinkContainer>
                <Button bsStyle="danger"
                        bsSize="sm"
                        onClick={::this.handleRemove}
                        data-userid={user.user_id}
                        disabled={this.isSameUser(user)}>
                  Remove
                </Button>
              </ButtonGroup>
            </td>
          </tr>
        })}
      </tbody>
    </Table>
  }
}