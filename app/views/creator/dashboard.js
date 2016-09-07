import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer, push, replace} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
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
      users: {profile},
      settings
    } = getState()

    let q = {
      ...settings,
      user_id: profile.user_id
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
    profile: state.users.profile
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
export default class CreatorDashboardView extends Component {
  render() {
    let name = this.props.creator.user_metadata.name
      ? this.props.creator.user_metadata.name
      : this.props.creator.email
    let title = `Welcome, ${name}!`
    return <div>
      <PageHeader title={title} />
      <Grid>
        <Row>
          <Col xs={12}>
            <LedgerDetail {...this.props} />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}