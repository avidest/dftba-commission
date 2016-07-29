import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import ProductDetail from '../../components/product-detail'
import ProductDetailForm from '../../forms/product-detail'
import {loadProduct, addCommission} from '../../ducks/products'
import {loadUsers} from '../../ducks/users'

const dataDeps = [
  {
    promise: ({store, params})=> {
      let promises = []
      let {products, users} = store.getState()
      if (params.id) {
        if (!products.selected || products.selected.id != params.id) {
          promises.push(store.dispatch(loadProduct(params.id)))
        }
      }
      if (!users.list.length) {
        promises.push(store.dispatch(loadUsers()))
      }
      return Promise.all(promises)
    }
  }
]

const mapStateToProps = state => ({product: state.products.selected})

const mapDispatchToProps = {
  addCommission
}

@asyncConnect(dataDeps, mapStateToProps, mapDispatchToProps)
export default class ProductDetailView extends Component {
  render() {
    return <div>
      <PageHeader title={this.props.product.title} />
      <Grid>
        <Row>
          <Col xs={12}>
            <ProductDetail {...this.props} />
            <ProductDetailForm onSubmit={this.props.addCommission} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}