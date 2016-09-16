import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer, push, replace} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import LedgerDetail from '../../components/ledger-detail'
import DatePicker from '../../connectors/date-picker'
import {
  loadSummariesByUser,
  loadTransactionsByUser
} from '../../ducks/ledger'

const deps = [{
  promise({ store: {getState, dispatch}, location: {query}, params }) {
    let promises = []

    let {
      ledger: {
        selectedSummary,
        selectedTransactions
      },
      users: {profile}
    } = getState()

    let q = {
      user_id: profile.user_id,
      kind: 'debit'
    }

    promises.push(dispatch(loadSummariesByUser(q)))
    promises.push(dispatch(loadTransactionsByUser(q)))

    return Promise.all(promises)
  }
}]

const mapStateToProps = (state, props) => {
  let ret = {
    transactions: state.ledger.selectedTransactions,
    summary: state.ledger.selectedSummary,
    creator: state.users.profile,
    profile: state.users.profile,
  }
  return ret
}

const mapDispatchToProps = {
  loadSummariesByUser,
  loadTransactionsByUser,
  push,
  replace
}

@asyncConnect(deps, mapStateToProps, mapDispatchToProps)
export default class CreatorIncomeView extends Component {

  handleDateChange(opts) {
    let {profile} = this.props
    let query = {
      startDate: opts.start,
      endDate: opts.end,
      kind: 'debit'
    }
    this.props.loadSummariesByUser({...query, user_id: profile.user_id })
    this.props.loadTransactionsByUser({...query, user_id: profile.user_id })
  }

  render() {
    let title = `My Expenses`
    return <div>
      <PageHeader title={title}>
        <div className="pull-right">
          <DatePicker onChange={::this.handleDateChange} bsSize="lg" />
        </div>
      </PageHeader>
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <LedgerDetail {...this.props} noSummary kind="debit" />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}