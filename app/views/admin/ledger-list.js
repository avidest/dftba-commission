import React, {Component} from 'react'
import {asyncConnect} from 'protium'
import {LinkContainer, push} from 'protium/router'
import PageHeader from '../../components/page-header'
import DataGrid from '../../connectors/grid'
import DatePicker from '../../connectors/date-picker'
import { loadCreators } from '../../ducks/users'
import {
  loadSummaries,
  bulkExport,
  bulkPayout,
  GRID_KEY
} from '../../ducks/ledger'
import {
  Grid,
  Row,
  Col,
  ButtonGroup,
  Button,
  Image
} from 'react-bootstrap'
import filter from 'lodash/filter'
import escapeRegExp from 'lodash/escapeRegExp'
import * as gridActions from '../../ducks/grid'
import moment from 'moment'

const dataDeps = [{
  promise({ store: {getState, dispatch}, location: {query} }) {
    let promises = []
    let {ledger: {summaries}, users: {creators}} = getState()

    if (!getState().grid[GRID_KEY]) {
      dispatch(gridActions.init(null, GRID_KEY))
    }

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

const mapDispatchToProps = {
  loadSummaries,
  bulkPayout,
  bulkExport,
  select: gridActions.select,
  selectAll: gridActions.selectAll,
  loadAll: gridActions.loadAll,
  setQuery: gridActions.setQuery,
  push
}

@asyncConnect(dataDeps, mapStateToProps, mapDispatchToProps)
export default class LedgerView extends Component {

  handleCellClick(){}
  handleHeaderClick(){}
  handleSetPage(){}

  handleSelect(opts) {
    this.props.select(opts, GRID_KEY)
  }

  handleSelectAll(opts) {
    this.props.selectAll(opts, GRID_KEY)
  }

  handleSetQuery(q){
    this.props.setQuery(q, GRID_KEY)
    let regex = new RegExp(escapeRegExp(q), 'ig')
    let {summaries} = this.props
    let filtered = filter(summaries, s => s.user.name.match(regex))
    this.props.loadAll({
      data: filtered,
      total: filtered.length
    }, GRID_KEY)
  }

  handleDateChange(opts) {
    this.props.loadSummaries({ startDate: opts.start, endDate: opts.end })
  }

  handleBulkAction({action, data}){
    switch(action.type) {
      case 'payout':
        return this.props.bulkPayout(data)
      case 'exportcsv':
        return this.props.bulkExport(data)
      default:
        console.log('no action performed')
        break;
    }
  }

  render() {
    return <div>
      <PageHeader route={this.props.route}>
        <div className="pull-right">
          <DatePicker onChange={::this.handleDateChange} bsSize="lg" />
          &nbsp;
          <LinkContainer to="/admin/ledger/transaction?debit=1">
            <Button bsSize="lg">Add Expense</Button>
          </LinkContainer>
          &nbsp;
          <LinkContainer to="/admin/ledger/transaction?credit=1">
            <Button bsSize="lg">Add Credit</Button>
          </LinkContainer>
        </div>
      </PageHeader>
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <DataGrid type={GRID_KEY}
              cellStyle={{verticalAlign: 'middle'}}
              onCellClick={::this.handleCellClick}
              onHeaderClick={::this.handleHeaderClick}
              onSetQuery={::this.handleSetQuery}
              onBulkAction={::this.handleBulkAction}
              onSelect={::this.handleSelect}
              onSelectAll={::this.handleSelectAll}
              selectable
              searchLabel="Filter by Creator Name..."
              pageable={false}
              bulkActions={[
                {label: 'Pay Out', type: 'payout'},
                {label: 'Export as CSV', type: 'exportcsv'}
              ]}
              columns={[
                ['Creator', Creator],
                ['Starting Balance', 'startingBalance'],
                ['Gross Expenses', Debits],
                ['Gross Income', Credits],
                ['Net Balance', NetBalance],
                ['Actions', Actions, {className: 'text-right'}]
              ]}
            />
          </Col>
        </Row>
      </Grid>
      {this.props.children}
    </div>
  }
}

function Debits({record}) {
  return <span className="text-danger">{record.grossDebits}</span>
}

function Credits({record}) {
  return <span className="text-success">{record.grossCredits}</span>
}

function NetBalance({record}) {
  let balance = parseInt(record.netBalance, 10)
  return <span className={balance > 0 ? 'text-success' : ''}>{record.netBalance}</span>
}

function Creator(props) {
  let {record} = props
  return <span>
      <Image style={{maxWidth: '20px', backgroundSize: 'cover'}}
             src={record.user.picture}
             circle />
    &nbsp;{record.user.name}
  </span>
}

function Actions(props) {
  let {record} = props
  let start = parseInt(record.startingBalance, 10)
  let end = parseInt(record.netBalance, 10)
  return <ButtonGroup bsSize="sm">
    <LinkContainer to={`/admin/ledger/${record.user_id}`}>
      <Button>
        Details
      </Button>
    </LinkContainer>
    <Button bsStyle="primary" disabled={end <= 0}
            onClick={e => props.routing.push(buildPayoutLink(record, props))}
    >Pay Out</Button>
  </ButtonGroup>
}

function buildPayoutLink(record, props) {
  var str = `/admin/ledger/transaction?
    debit=1
    &payout=1
    &amount=${record.netBalance}
    &user_id=${record.user_id}
    &created_at=${moment(record.cycleEnd).subtract(1, 'second').toJSON()}
  `
  return str.replace(/\s*/gi, '')
}