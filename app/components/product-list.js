import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Table,
  Image,
  Button
} from 'react-bootstrap'
import TimeAgo from 'react-timeago'

export default function ProductList(props) {
  let { products } = props
  return <Table>
    <thead>
      <ProductListHeader />
    </thead>
    <tbody>
      {products.map(product => <ProductListRow key={product.id} product={product} />)}
    </tbody>
  </Table>
}

function ProductListHeader(props) {
  return <tr>
    <th>Image</th>
    <th>Title</th>
    <th>Last Updated</th>
    <th className="text-right">Actions</th>
  </tr>
}

function ProductListRow(props) {
  let { product } = props
  let imageSrc = product.images.length
    ? imageSize(product.images[0].src, '50x')
    : 'http://placehold.it/50x50'

  let style = {verticalAlign: 'middle'}

  return <tr>
    <td style={style}>
      <Image style={{maxWidth: '50px', backgroundSize: 'cover'}}
             src={imageSrc}
             circle
             thumbnail />
    </td>
    <td style={style}>{product.title}</td>
    <td style={style}><TimeAgo date={product.updated_at} /></td>
    <td style={style} className="text-right">
      <LinkContainer to={`/admin/products/${product.id}`}>
        <Button>
        Edit Commission
        </Button>
      </LinkContainer>
    </td>
  </tr>
}

import Path from 'path'

function imageSize(src, size = '100x') {
  let ext = Path.extname(src)
  let base = src.replace(ext, '')
  return `${base}_${size}${ext}`
}
