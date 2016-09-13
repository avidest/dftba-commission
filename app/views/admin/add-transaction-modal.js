import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer, goBack} from 'protium/router'
import {Grid, Row, Col, Button, ButtonGroup, Modal} from 'react-bootstrap'
import TransactionDetailForm from '../../forms/transaction-detail'
import {createTransaction} from '../../ducks/ledger'
import {loadCreators} from '../../ducks/users'

const dataDeps = [
  {
    promise({store, params, location: {query}}) {
      let promises = []
      let {ledger, users} = store.getState()
      if (!users.creators.length) {
        promises.push(store.dispatch(loadCreators()))
      }
      return Promise.all(promises)
    }
  }
]

const mapStateToProps = state => ({
  creators: state.users.creators
})

const mapDispatchToProps = {
  createTransaction,
  goBack
}

@asyncConnect(dataDeps, mapStateToProps, mapDispatchToProps)
export default class ProductDetailView extends Component {

  get type() {
    let {location:{query}} = this.props
    return query.debit ? 'debit' : 'credit'
  }
  
  handleClose() {
    this.props.goBack()
  }

  handleSave() {
    let comp = this.refs.transactionForm.getWrappedInstance()
    if (comp) {
      comp.submit()
    }
  }

  handleSubmit(values) {
    return this.props.createTransaction(values)
      .then(updated => {
        setTimeout(x => this.props.goBack(), 1000)
        return updated
      })
  }

  render() {
    let {product, creators} = this.props
    return <Modal show={true} onHide={::this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create {this.type === 'debit' ? 'Expense' : 'Credit'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TransactionDetailForm
          ref="transactionForm"
          noSubmit
          onSubmit={::this.handleSubmit}
          type={this.type}
          params={this.props.location.query}
        />
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button onClick={::this.handleClose}>Close</Button>
          <Button bsStyle="primary" onClick={::this.handleSave}>Save</Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  }
}
