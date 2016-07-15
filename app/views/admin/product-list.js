import React, {Component} from 'react'
import {connect} from 'protium'
import {LinkContainer} from 'protium/router'
import PageHeader from '../../components/page-header'
import {
  Grid, 
  Row, 
  Col, 
  ButtonGroup, 
  Button,
  Table,
  Image
  } from 'react-bootstrap'

@connect(state => ({products: state.products.list}))
export default class ProductListView extends Component {

  renderProductTable(products) {
    return <Table>
      {this.renderProductTableHeader()}
      {this.renderProductTableBody(products)}
    </Table>
  }

  renderProductTableHeader() {
    return <thead>
      <tr>
        <th>Image</th>
        <th>Title</th>
        <th>Last Updated</th>
        <th className="text-right">Actions</th>
      </tr>
    </thead>
  }

  renderProductTableBody(products) {
    return <tbody>
      {products.map(::this.renderProductRow)}
    </tbody>
  }

  renderProductRow(product) {

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

  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid>
        <Row>
          <Col xs={12}>
            {this.renderProductTable(this.props.products)}
          </Col>
        </Row>
      </Grid>
    </div>
  }
}