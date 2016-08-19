import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button, Table} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import DavePicker from '../../components/dave-picker'
import {loadTransactions} from '../../ducks/ledger'

const dataDeps = [{
  promise({ store, location: {query} }) {
    let promises = []

    if (!store.getState().ledger.transactions.length) {
      promises.push(store.dispatch(loadTransactions()))
    }

    return Promise.all(promises)
  }
}]

const mapStateToProps = state => ({
  transactions: state.ledger.transactions
})

const mapDispatchToProps = {

}

@asyncConnect(dataDeps, mapStateToProps, mapDispatchToProps)
export default class OrderListView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route}>
        <div className="pull-right">
          <Button bsSize="lg">Add Debit</Button>
          &nbsp;
          <Button bsSize="lg">Add Credit</Button>
        </div>
      </PageHeader>
      <Grid>
        <Row>
          <Col xs={12}>
          <pre>{JSON.stringify(this.props.transactions, null, 2)}</pre>
          </Col>
        </Row>
      </Grid>
      {this.props.children}
    </div>
  }
}