import React from 'react'
import {
  Well,
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap'
import {LinkContainer} from 'protium/router'
import find from 'lodash/find'
import minBy from 'lodash/minBy'
import maxBy from 'lodash/maxBy'
import {calcCommission} from '../../lib/transactions'

export default function ProductDetail(props) {
  const {product, creators} = props
  if (!product.commissions || !product.commissions.length) {
    return <Well>No commissions splits yet!</Well>
  }

  const minVariant = minBy(product.variants, v => parseFloat(v.price))
  const maxVariant = minBy(product.variants, v => parseFloat(v.price))

  function handleRemove() {
    if (confirm('Are you sure you wish to remove this commission record?')) {
      props.removeCommission(commission)
    }
  }

  return <div>
    <Table bordered hover responsive>
      <thead>
      <tr>
        <th>Creator</th>
        <th>Percent</th>
        <th className="text-right">Flat Rate</th>
        <th className="text-right">Commission</th>
        <th className="text-right">Actions</th>
      </tr>
      </thead>
      <tbody>
      {product.commissions.map(commission => {
        let minPrice = calcCommission(minVariant.price, commission)
        let maxPrice = calcCommission(maxVariant.price, commission)
        return <tr key={commission.id}>
          <td>{getUsername(commission, creators) || '<deleted>'}</td>
          <td>{commission.percent}%</td>
          <td className="text-right">${commission.flat}</td>
          <td className="text-right">{product.variants.length > 1 ? `$${minPrice}—$${maxPrice}` : `$${minPrice}`}</td>
          <td className="text-right">
            <ButtonGroup>
              <LinkContainer to={`/admin/products/${product.id}/commissions/${commission.id}`}>
                <Button bsSize="xs">
                  Edit
                </Button>
              </LinkContainer>
              <Button bsStyle="danger" bsSize="xs" onClick={handleRemove}>
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