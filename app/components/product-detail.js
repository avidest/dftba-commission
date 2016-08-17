import React from 'react'
import {find} from 'lodash'
import {
  Well,
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap'
import {LinkContainer} from 'protium/router'

export default function ProductDetail(props) {
  let {product, creators} = props
  if (!product.commissions || !product.commissions.length) {
    return <Well>No commissions splits yet!</Well>
  }
  console.log(props)
  return <div>
    <Table bordered hover responsive>
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
              <LinkContainer to={`/admin/products/${product.id}/commissions/${commission.id}`}>
                <Button bsSize="xs">
                  Edit
                </Button>
              </LinkContainer>
              <Button bsStyle="danger" bsSize="xs" onClick={e => props.removeCommission(commission)}>
                Remove
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      })}
      </tbody>
    </Table>
  </div>
}

function getUsername(commission, users) {
  let user = find(users, { user_id: commission.user_id })
  if (user) {
    return user.user_metadata.name
  }
  return null
}