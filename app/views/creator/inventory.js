import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import {asyncConnect} from 'protium'
import PageHeader from '../../components/page-header'
import {loadProductByCurrentUser} from '../../ducks/products'
import InventoryList from '../../components/inventory-list'

const deps = [{
  promise({store: {dispatch, getState}}) {
    let {products: {inventory}} = getState()
    let promises = []
    if (!inventory || !inventory.length) {
      promises.push(dispatch(loadProductByCurrentUser()))
    }
    return Promise.all(promises)
  }
}]

const mapStateToProps = state => ({
  products: state.products.inventory
})

@asyncConnect(deps, mapStateToProps)
export default class CreatorInventoryView extends Component {
  render() {
    console.log(this.props.products)
    return <div>
      <PageHeader title="My Inventory" />
      <Grid>
        <Row>
          <Col xs={12}>
            <InventoryList products={this.props.products} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}