import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer, push, replace} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import DatePicker from '../../connectors/date-picker'
import LedgerDetail from '../../components/ledger-detail'
import find from 'lodash/find'
import {
  loadSummariesByUser,
  loadTransactionsByUser
} from '../../ducks/ledger'
import {
  loadCreators
} from '../../ducks/users'

const deps = [{
  promise({ store: {getState, dispatch}, location: {query}, params }) {
    let promises = []

    let {
      ledger: {
        selectedSummary,
        selectedTransactions
      }, 
      users: {creators},
      settings
    } = getState()

    let q = {...query, user_id: params.user_id}

    if (!creators.length) {
      promises.push(dispatch(loadCreators()))
    }

    let payload = {...settings, user_id: params.user_id}

    promises.push(dispatch(loadSummariesByUser(payload)))

    promises.push(dispatch(loadTransactionsByUser(payload)))

    return Promise.all(promises)
  }
}]

const mapStateToProps = (state, props) => {
  let ret = {
    transactions: state.ledger.selectedTransactions,
    summary: state.ledger.selectedSummary,
    creators: state.users.creators
  }
  if (props.params.user_id) {
    ret.creator = find(state.users.creators, {user_id: props.params.user_id})
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
export default class OrderDetailView extends Component {

  handleDateChange(values) {
    this.props.loadSummariesByUser({
      startDate: values.start, 
      endDate: values.end,
      user_id: this.props.creator.user_id
    })
    this.props.loadTransactionsByUser({
      startDate: values.start, 
      endDate: values.end,
      user_id: this.props.creator.user_id
    })
  }

  render() {
    let creator = this.props.creator
    let name = creator.user_metadata && creator.user_metadata.name
      ? creator.user_metadata.name
      : creator.email
    let title = `Ledger for ${name}`
    return <div>
      <PageHeader title={title}>
        <div className="pull-right">
          <DatePicker onChange={::this.handleDateChange} bsSize="lg" pullRight />
        </div>
      </PageHeader>
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <LedgerDetail {...this.props} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}