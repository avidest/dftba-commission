import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer, push} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button, Table} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import LedgerList from '../../components/ledger-list'
import { loadCreators } from '../../ducks/users'
import {
  loadSummaries
} from '../../ducks/ledger'


const dataDeps = [{
  promise({ store: {getState, dispatch}, location: {query} }) {
    let promises = []
    let {ledger: {summaries}, users: {creators}} = getState()

    if (!creators.length) {
      promises.push(dispatch(loadCreators()))
    }

    if (!summaries.length) {
      promises.push(dispatch(loadSummaries(query)))
    }

    return Promise.all(promises)
  }
}]

const mapStateToProps = ({ ledger: {summaries}, users: {creators} }) => ({
  summaries,
  creators
})

const mapDispatchToProps = { loadSummaries, push }

@asyncConnect(dataDeps, mapStateToProps, mapDispatchToProps)
export default class LedgerView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route}>
        <div className="pull-right">
          <LinkContainer to="/admin/ledger/transaction?debit=1">
            <Button bsSize="lg">Add Debit</Button>
          </LinkContainer>
          &nbsp;
          <LinkContainer to="/admin/ledger/transaction?credit=1">
            <Button bsSize="lg">Add Credit</Button>
          </LinkContainer>
        </div>
      </PageHeader>
      <Grid>
        <Row>
          <Col xs={12}>
            <LedgerList summaries={this.props.summaries} 
              loadSummaries={this.props.loadSummaries}
              location={this.props.location}
              push={this.props.push}
            />
          </Col>
        </Row>
      </Grid>
      {this.props.children}
    </div>
  }
}