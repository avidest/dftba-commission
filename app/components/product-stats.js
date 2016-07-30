import React from 'react'
import {maxBy, minBy} from 'lodash'
import {
  Table,
  Image
} from 'react-bootstrap'

export default function ProductStats(props) {
  let {product} = props
  return <div>
    {!!product.images.length && <Image src={product.images[0].src} thumbnail style={{marginBottom: '2em'}} />}
    <Table>
      <tbody>
      <tr>
        <th>Price</th>
        <td>{getProductPriceRange(product)}</td>
      </tr>
      <tr>
        <th>Vendor</th>
        <td>{product.vendor}</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>{product.product_type}</td>
      </tr>
      <tr>
        <th>Published</th>
        <td>{product.published_at ? 'Yes' : 'No'}</td>
      </tr>
      </tbody>
    </Table>
  </div>
}

function getProductPriceRange(product) {
  if (product.price) return product.price
  let maxVariant = maxBy(product.variants, v => v.price)
  let minVariant = minBy(product.variants, v => v.price)
  if (maxVariant.price == minVariant.price) {
    return `$${maxVariant.price}`
  }
  return `$${maxVariant.price}—$${minVariant.price}`
}