import React from 'react'
import {find} from 'lodash'
import {
  Well,
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap'

export default function ProductDetail(props) {
  let {product, creators} = props
  if (!product.commissions || !product.commissions.length) {
    return <Well>No commissions splits yet!</Well>
  }
  return <Table bordered hover responsive>
    <thead>
    <tr>
      <th>Creator</th>
      <th>Percent (%)</th>
      <th>Flat Rate ($)</th>
      <th className="text-right">Actions</th>
    </tr>
    </thead>
    <tbody>
    {product.commissions.map(commission => {
      return <tr key={commission.id}>
        <td>{getUsername(commission, creators) || '<deleted>'}</td>
        <td>{commission.percent}</td>
        <td>{commission.flat}</td>
        <td className="text-right">
          <ButtonGroup>
            <Button bsSize="xs">
              Edit
            </Button>
            <Button bsStyle="danger" bsSize="xs">
              Remove
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    })}
    </tbody>
  </Table>
}

function getUsername(commission, users) {
  let user = find(users, { user_id: commission.user_id })
  if (user) {
    return user.user_metadata.name
  }
  return null
}