import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap'

export default class UserList extends Component {
  handleRemove(e) {
    e.preventDefault()
    if (confirm('Are you sure you wish to delete this user?')) {
      this.props.handleRemove({ user_id: e.target.dataset.userid })
    }
  }

  renderTableHeader() {
    return <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th className="text-right">Actions</th>
      </tr>
    </thead>
  }

  renderTableBody() {
    if (!this.props.users && !this.props.users.length) {
      return <tbody>
        <tr>
          <td colSpan="4">No users yet!</td>
        </tr>
      </tbody>
    }
    return <tbody>
      {this.props.users.map(user => {
        return <tr key={user.user_id}>
          <td>{user.user_metadata && user.user_metadata.name}</td>
          <td>{user.email}</td>
          <td>{(user.app_metadata && user.app_metadata.role) || 'creator'}</td>
          <td className="text-right">
            <ButtonGroup>
              <LinkContainer to={`/admin/users/${user.user_id}`}>
                <Button bsSize="sm">Edit</Button>
              </LinkContainer>
              <Button bsStyle="danger" bsSize="sm" onClick={::this.handleRemove} data-userid={user.user_id}>
                Remove
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      })}
    </tbody>
  }

  render() {
    return <Table>
      {this.renderTableHeader()}
      {this.renderTableBody()}
    </Table>
  }
}