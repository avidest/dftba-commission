import React, {Component} from 'react'
import {asyncConnect, bindActionCreators} from 'protium'
import {LinkContainer} from 'protium/router'
import PageHeader from '../../components/page-header'
import ProductList from '../../components/product-list'
import * as actions from '../../ducks/products'
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
        promises.push(store.dispatch(actions.loadProducts()))
      }
      return Promise.all(promises)
    }
  }
]

const mapsPropsToState = state => ({products: state.products})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

@asyncConnect(dataDeps, mapsPropsToState, mapDispatchToProps)
export default class ProductListView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid>
        <Row>
          <Col xs={12}>
            <ProductList products={this.props.products} 
                         actions={this.props.actions} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}