import React, {Component} from 'react'
import {connect} from 'protium'
import {LinkContainer} from 'protium/router'
import PageHeader from '../../components/page-header'
import ProductList from '../../components/product-list'
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
  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid>
        <Row>
          <Col xs={12}>
            <ProductList products={this.props.products} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}