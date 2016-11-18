import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {Table, Row, Col, Well, Label} from 'react-bootstrap'
import classnames from 'classnames'
import moment from 'moment'
import filter from 'lodash/filter'

export default function LedgerList(props) {
  let {
    transactions,
    summary,
    kind,
    sales,
    includeSales
  } = props

  if (!transactions) {
    transactions = []
  }

  if (kind) {
    transactions = filter(transactions, t => t.kind === kind)
  }

  let styles = includeSales ? {maxHeight: '500px', overflow: 'scroll'} : {}

  return <Row>
    {!props.noSummary === true && <Col xs={12}>
      <h3>Summary</h3>
      <SummaryViewer summary={summary} />
    </Col>}
    <Col sm={includeSales ? 7 : 12}>
      {!props.noSummary === true && <h3>Transaction Details</h3>}
      <div style={styles}>
        <Table hover responsive>
          <thead>
          <SummaryListHeader />
          </thead>
          <tbody>
          {(!transactions || !transactions.length) && <tr className="text-center">
            <td colSpan="6">No transactions for this cycle.</td>
          </tr>}
          {transactions && transactions.map(transaction => {
            return <TransactionRow key={transaction.id} transaction={transaction} kind={props.kind} />
          })}
          {!props.noSummary === true && <SummaryRow {...props} />}
          </tbody>
        </Table>
      </div>
    </Col>
    {includeSales && <Col sm={5}>
      <h3>Sales</h3>
      <Table hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>This Period</th>
            <th>To Date</th>
          </tr>
        </thead>
        <tbody>
          {(!sales || !sales.total) && <tr>
            <td colSpan="3">No Sales yet!</td>
          </tr>}
          {sales.total.map((grp, i) => {
            return <tr key={grp.variant_id}>
              <td>{grp.title}</td>
              <td>{sales.period[i] ? sales.period[i].quantity : 0}</td>
              <td>{grp.quantity}</td>
            </tr>
          })}
        </tbody>
      </Table>
    </Col>}
  </Row>
}

function SummaryViewer(props) {
  let {summary} = props
  return <Row className="ledger-detail-summary">
    <Col sm={3}>
      <Well>
        <h5>Starting Balance</h5>
        <p>${summary.startingBalance || (0).toFixed(2)}</p>
      </Well>
    </Col>
    <Col sm={3}>
      <Well>
        <h5>Gross Expenses</h5>
        <p>${summary.grossDebits || (0).toFixed(2)}</p>
      </Well>
    </Col>
    <Col sm={3}>
      <Well>
        <h5>Gross Income</h5>
        <p>${summary.grossCredits || (0).toFixed(2)}</p>
      </Well>
    </Col>
    <Col sm={3}>
      <Well>
        <h5>Net Balance</h5>
        <p>${summary.netBalance || (0).toFixed(2)}</p>
      </Well>
    </Col>
  </Row>
}

function SummaryListHeader(props) {
  return <tr>
    <th>Kind</th>
    <th>Created On</th>
    <th>Description</th>
    <th className="text-right">Amount</th>
  </tr>
}

function TransactionRow(props) {
  let {transaction} = props
  let amountClasses = classnames({
    'text-danger': transaction.kind === 'debit' && !transaction.payout && props.kind !== 'debit',
    'text-success': transaction.payout,
  }, 'text-right')

  let labelStyle = 'default'
  if (transaction.payout) {
    labelStyle = 'success'
  }

  return <tr>
    <td><Label bsStyle={labelStyle} style={{display: 'block', paddingTop: '0.3em'}}>
      {transaction.payout ? 'PAYOUT' : transaction.kind.toUpperCase()}
    </Label></td>
    <td className="text-muted">
      {moment(transaction.created_at).format('lll')}
    </td>
    <td className="text-muted">
      {transaction.description ? transaction.description : '<No description provided>'}
    </td>
    <td className={amountClasses}>${transaction.payout ? (parseFloat(transaction.amount) * -1) : transaction.amount}</td>
  </tr>
}

function SummaryRow(props) {
  let { summary } = props
  let style = {verticalAlign: 'middle'}

  return <tr>
    <td />
    <td />
    <td className="text-right"><strong>Total:</strong></td>
    <td style={style} className="text-right"><strong>${summary.netBalance || (0).toFixed(2)}</strong></td>
  </tr>
}

import Path from 'path'

function imageSize(src, size = '100x') {
  let ext = Path.extname(src)
  let base = src.replace(ext, '')
  return `${base}_${size}${ext}`
}