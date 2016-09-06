import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Table,
  Image,
  Button,
  Pagination
} from 'react-bootstrap'
import TimeAgo from 'react-timeago'
import {getSize} from './helpers/images'

export default function ProductList(props) {
  let { products, actions } = props

  return <div>
    <Paginator {...props} />
    <Table hover responsive>
      <thead>
        <ProductListHeader />
      </thead>
      <tbody>
        {products.list.map(product => <ProductListRow key={product.id} product={product} />)}
      </tbody>
    </Table>
    <Paginator {...props} />
  </div>
}

function Paginator(props) {
  let { products, actions } = props
  return <div className="text-center">
    <Pagination
      prev
      next
      first
      last
      ellipsis
      boundaryLinks
      items={getItemCount(products)}
      maxButtons={6}
      activePage={products.queryOpts.page}
      onSelect={actions.setPage}
    />
  </div>
}

function getItemCount(products) {
  return Math.ceil(products.count / products.queryOpts.limit) - 1
}

function ProductListHeader(props) {
  return <tr>
    <th>&nbsp;</th>
    <th>Title</th>
    <th>Vendor</th>
    <th>Last Updated</th>
    <th className="text-right">Actions</th>
  </tr>
}

function ProductListRow(props) {
  let { product } = props
  let imageSrc = product.images.length
    ? getSize(product.images[0].src, '50x')
    : `/assets/images/no-image.png`

  let style = {verticalAlign: 'middle'}

  return <tr>
    <td style={style}>
      <Image style={{maxWidth: '50px', backgroundSize: 'cover'}}
             src={imageSrc}
             circle
             thumbnail />
    </td>
    <td style={style}>{product.title}</td>
    <td style={style}>{product.vendor}</td>
    <td style={style}><TimeAgo date={product.updated_at} /></td>
    <td style={style} className="text-right">
      <LinkContainer to={`/admin/products/${product.id}`}>
        <Button bsSize="xs">
          Edit Commission
        </Button>
      </LinkContainer>
    </td>
  </tr>
}
