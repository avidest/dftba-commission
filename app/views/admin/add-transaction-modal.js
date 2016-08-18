import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer, goBack} from 'protium/router'
import {Grid, Row, Col, Button, ButtonGroup, Modal} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import ProductDetail from '../../components/product-detail'
import ProductStats from '../../components/product-stats'
import TransactionDetailForm from '../../forms/transaction-detail'
import {loadProduct, updateCommission, removeCommission} from '../../ducks/products'
import {loadUsers, loadCreators} from '../../ducks/users'
import find from 'lodash/find'

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
  updateCommission,
  removeCommission,
  goBack
}

@asyncConnect(dataDeps, mapStateToProps, mapDispatchToProps)
export default class ProductDetailView extends Component {
  
  handleClose() {
    this.props.goBack()
  }

  handleSave() {
    let comp = this.refs.productDetailForm2.getWrappedInstance()
    if (comp) {
      console.log(comp)
      comp.submit()
    }
  }

  handleSubmit(values) {
    return this.props.updateCommission(values)
      .then(updated => {
        setTimeout(x => this.props.goBack(), 1000)
        return updated
      })
  }

  handleRemove() {
    let id = parseInt(this.props.params.commission_id)
    let comish = find(this.props.product.commissions, {id})
    if (!confirm('Are you sure you wish to delete this commission record?')) {
      return;
    }
    return this.props.removeCommission(comish)
      .then(deleted => {
        setTimeout(x => this.props.goBack(), 1000)
        return deleted
      })
  }

  render() {
    console.log(this.props)
    let {product, creators} = this.props
    return <Modal show={true} onHide={::this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TransactionDetailForm 
          noSubmit
          onSubmit={::this.handleSubmit}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="pull-left" bsStyle="danger" onClick={::this.handleRemove}>
        Delete
        </Button>
        <ButtonGroup>
          <Button onClick={::this.handleClose}>Close</Button>
          <Button bsStyle="primary" onClick={::this.handleSave}>Save</Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  }
}
