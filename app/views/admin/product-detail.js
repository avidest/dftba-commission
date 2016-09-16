import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, Button, ButtonGroup} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import ProductDetail from '../../components/product-detail'
import ProductStats from '../../components/product-stats'
import ProductDetailForm from '../../forms/product-detail'
import {loadProduct, addCommission, removeCommission} from '../../ducks/products'
import {loadUsers, loadCreators} from '../../ducks/users'

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
      if (!users.creators.length) {
        promises.push(store.dispatch(loadCreators()))
      }
      return Promise.all(promises)
    }
  }
]

const mapStateToProps = state => ({
  product: state.products.selected,
  creators: state.users.creators
})

const mapDispatchToProps = {
  addCommission,
  removeCommission
}

@asyncConnect(dataDeps, mapStateToProps, mapDispatchToProps)
export default class ProductDetailView extends Component {
  render() {
    let {product, creators} = this.props
    return <div>
      <PageHeader title={this.props.product.title}>
        <div className="pull-right">
          <ButtonGroup>
            <a className="btn btn-default btn-lg"
               href={`https://${process.env.SHOPIFY_SHOP}/admin/products/${product.id}`}
               target="_blank">
              Admin View
            </a>
            {product.published_at && <a className="btn btn-default btn-lg"
                                        href={`https://${process.env.SHOPIFY_SHOP}/products/${product.handle}`}
                                        target="_blank">
              Storefront View
            </a>}
          </ButtonGroup>
          &nbsp;&nbsp;
          <LinkContainer to="/admin/products">
            <Button bsSize="lg">Back</Button>
          </LinkContainer>
        </div>
      </PageHeader>
      <Grid fluid>
        <Row>
          <Col sm={4}>
            <h3>Product Details</h3>
            <ProductStats {...this.props} />
          </Col>
          <Col sm={8}>
            <h3>Commission Splits</h3>
            <ProductDetail {...this.props} />
            <br/>
            <h4>Add Commission Split</h4>
            {!this.props.children && <ProductDetailForm onSubmit={this.props.addCommission} />}
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    </div>
  }
}
