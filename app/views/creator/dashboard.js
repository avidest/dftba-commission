import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer, push, replace} from 'protium/router'
import {Grid, Row, Col, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import LedgerDetail from '../../components/ledger-detail'
import {
  loadSummariesByUser,
  loadTransactionsByUser,
  exportUserTransactionsCSV,
} from '../../ducks/ledger'
import {
  loadInventorySalesByUser,
  exportSalesCSV
} from '../../ducks/products'
import DatePicker from '../../connectors/date-picker'

const deps = [{
  promise({ store: {getState, dispatch}, location: {query}, params }) {
    let promises = []

    let {
      ledger: {
        selectedSummary,
        selectedTransactions
      },
      users: {profile},
      settings
    } = getState()

    let q = {
      ...settings,
      user_id: profile.user_id
    }

    promises.push(dispatch(loadSummariesByUser(q)))
    promises.push(dispatch(loadTransactionsByUser(q)))
    promises.push(dispatch(loadInventorySalesByUser(q)))

    return Promise.all(promises)
  }
}]

const mapStateToProps = (state, props) => {
  return {
    transactions: state.ledger.selectedTransactions,
    summary: state.ledger.selectedSummary,
    creator: state.users.profile,
    profile: state.users.profile,
    sales: state.products.sales
  }
}

const mapDispatchToProps = {
  loadSummariesByUser,
  loadTransactionsByUser,
  loadInventorySalesByUser,
  exportSalesCSV,
  exportUserTransactionsCSV,
  push,
  replace
}

@asyncConnect(deps, mapStateToProps, mapDispatchToProps)
export default class CreatorDashboardView extends Component {

  handleDateChange(opts) {
    let {profile} = this.props
    let query = {
      startDate: opts.start,
      endDate: opts.end
    }
    this.props.loadSummariesByUser({...query, user_id: profile.user_id })
    this.props.loadTransactionsByUser({...query, user_id: profile.user_id })
    this.props.loadInventorySalesByUser({...query, user_id: profile.user_id })
  }

  handleExportSales() {
    this.props.exportSalesCSV()
  }

  handleExportTransactions() {
    this.props.exportUserTransactionsCSV()
  }

  render() {
    if (!this.props.profile) {
      return <div/>
    }
    let name = this.props.creator.user_metadata.name
      ? this.props.creator.user_metadata.name
      : this.props.creator.email
    let title = `Welcome, ${name}!`
    return <div>
      <PageHeader title={title}>
        <div className="pull-right">
          <Button bsSize="lg" onClick={::this.handleExportTransactions}>Export Transactions</Button>
          {' '}
          <Button bsSize="lg" onClick={::this.handleExportSales}>Export Sales</Button>
          {' '}
          <DatePicker onChange={::this.handleDateChange} bsSize="lg" pullRight />
        </div>
      </PageHeader>
      <Grid fluid>
        <Row>
          <Col sm={12}>
            <LedgerDetail {...this.props} includeSales />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}