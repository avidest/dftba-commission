import React, {Component} from 'react'

export default function ProductList(props) {
  let { products } = props
  return <Table>
    <thead>
      <ProductListHeader />
    </thead>
    <tbody>
      {products.map(product => <ProductListRow product={product} />)}
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
  let imageSrc = product.image 
    ? product.image.src
    : 'http://placehold.it/50x50'

  return <tr key={product.id}>
    <td><Image style={{maxWidth: '50px', backgroundSize: 'cover'}} src={imageSrc} circle thumbnail /></td>
    <td>{product.title}</td>
    <td>{product.updated_at}</td>
    <td className="text-right">
      <Button>
      Edit Commission
      </Button>
    </td>
  </tr>
}
