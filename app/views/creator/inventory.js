import React, {Component} from 'react'
import {Grid, Row, Col, Button} from 'react-bootstrap'
import {asyncConnect} from 'protium'
import PageHeader from '../../components/page-header'
import {loadProductByCurrentUser, exportCSV} from '../../ducks/products'
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

const mapDispatchToProps = {
  exportCSV
}

@asyncConnect(deps, mapStateToProps, mapDispatchToProps)
export default class CreatorInventoryView extends Component {
  handleExport() {
    this.props.exportCSV()
  }

  render() {
    return <div>
      <PageHeader title="My Inventory">
        <div className="pull-right">
          <Button bsSize="lg" onClick={::this.handleExport}>Export CSV</Button>
        </div>
      </PageHeader>
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <InventoryList products={this.props.products} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}