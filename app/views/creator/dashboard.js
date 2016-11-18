import React, {Component} from 'react'
import {connect} from 'protium'
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

const mapStateToProps = (state, props) => {
  return {
    transactions: state.ledger.selectedTransactions,
    summary: state.ledger.selectedSummary,
    creator: state.users.profile,
    profile: state.users.profile,
    sales: state.products.sales,
    settings: state.settings
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

@connect(mapStateToProps, mapDispatchToProps)
export default class CreatorDashboardView extends Component {

  componentDidMount() {
    let {profile, settings} = this.props

    let query = {
      ...settings,
      user_id: profile.user_id
    }

    this.props.loadSummariesByUser(query)
    this.props.loadTransactionsByUser(query)
    this.props.loadInventorySalesByUser(query)
  }

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