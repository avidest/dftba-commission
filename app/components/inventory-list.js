import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Table,
  Image,
  Button,
  Pagination
} from 'react-bootstrap'
import {calcCommission} from '../../lib/transactions'
import classnames from 'classnames'
import Icon from './icon'

export default function InventoryList(props) {
  let { products } = props

  return <div>
    <Table hover responsive>
      <thead>
      <InventoryListHeader />
      </thead>
      <tbody>
      {products.reduce((m, product) => {
        m.push(<InventoryListRow product={product} key={product.id} />)
        product.variants.forEach(variant => {
          variant.commission = product.commissions[0]
          m.push(<InventoryVariantRow variant={variant} key={variant.id} />)
        })
        return m
      }, [])}
      </tbody>
    </Table>
  </div>
}

function InventoryListHeader(props) {
  return <tr>
    <th>&nbsp;</th>
    <th>Product Title</th>
    <th>Published?</th>
    <th className="text-right">Price</th>
    <th className="text-right">Potential Commission</th>
    <th className="text-right">Inventory on Hand</th>
  </tr>
}

function getCommissionClasses(qty) {
  return classnames('text-right', {
    'text-success': qty > 10,
    'text-warning': qty > 0 && qty <= 10,
    'text-danger': qty <= 0
  })
}

function InventoryVariantRow(props) {
  let { variant } = props
  let style = {verticalAlign: 'middle'}
  return <tr>
    <td style={style}></td>
    <td style={style}>{variant.title}</td>
    <td style={style}></td>
    <td style={style} className="text-right">${variant.price}</td>
    <td style={style} className="text-right">${calcCommission(variant.price, variant.commission)}</td>
    <td style={style} className={getCommissionClasses(variant.inventory_quantity)}>{variant.inventory_quantity}</td>
  </tr>
}

function InventoryListRow(props) {
  let { product } = props
  let imageSrc = product.images.length
    ? imageSize(product.images[0].src, '50x')
    : `/assets/images/no-image.png`

  let style = {verticalAlign: 'middle'}

  return <tr className="product-row">
    <td style={style}>
      <Image style={{maxWidth: '50px', backgroundSize: 'cover'}}
             src={imageSrc}
             circle
             thumbnail />
    </td>
    <td style={style}>
      <strong>
        {product.published_at && <span>
        <a href={`https://${process.env.SHOPIFY_SHOP}/products/${product.handle}`} target="_blank">
          {product.title}
        </a>&nbsp;&nbsp;<Icon type="external-link" /></span>}
        {!product.published_at && product.title}
      </strong>
    </td>
    <td style={style} className={product.published_at ? 'text-success' : 'text-danger'}>
      {product.published_at ? <Icon type="check"/> : <Icon type="times-circle" />}
    </td>
    <td style={style} />
    <td style={style} />
    <td style={style} />
  </tr>
}

import Path from 'path'

function imageSize(src, size = '100x') {
  let ext = Path.extname(src)
  let base = src.replace(ext, '')
  return `${base}_${size}${ext}`
}