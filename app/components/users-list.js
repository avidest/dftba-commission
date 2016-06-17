import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap'

export default class UserList extends Component {
  renderTableHeader() {
    return <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
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
        return <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <ButtonGroup>
              <LinkContainer to={`/users/${user.id}`}>
                <Button bsSize="sm">Edit</Button>
              </LinkContainer>
              <Button bsStyle="danger" bsSize="sm">Remove</Button>
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