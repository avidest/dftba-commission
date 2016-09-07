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
      users: {profile}
    } = getState()

    let q = {
      user_id: profile.user_id,
      kind: 'credit'
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
  render() {
    let title = `My Income`
    return <div>
      <PageHeader title={title} />
      <Grid>
        <Row>
          <Col xs={12}>
            <LedgerDetail {...this.props} noSummary />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}