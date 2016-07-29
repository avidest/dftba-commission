import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer} from 'protium/router'
import PageHeader from '../../components/page-header'
import ProductList from '../../components/product-list'
import {loadProducts} from '../../ducks/products'
import {
  Grid, 
  Row, 
  Col, 
  ButtonGroup, 
  Button,
  Table,
  Image
} from 'react-bootstrap'

const dataDeps = [
  {
    promise: ({store, params})=> {
      let promises = []
      let {products} = store.getState()
      if (!products.list.length) {
        promises.push(store.dispatch(loadProducts()))
      }
      return Promise.all(promises)
    }
  }
]

@asyncConnect(dataDeps, state => ({products: state.products.list}))
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