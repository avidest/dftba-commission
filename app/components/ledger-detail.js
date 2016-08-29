import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Table,
  Image,
  Button,
  Pagination,
  Row,
  Col,
  Well,
  Label
} from 'react-bootstrap'
import classnames from 'classnames'
import DavePicker from './dave-picker'

export default function LedgerList(props) {
  let {
    transactions,
    summary,
    push,
    replace,
    loadSummariesByUser,
    loadTransactionsByUser,
    location,
    params,
    kind
  } = props

  function handleChange(opts) {
    loadSummariesByUser({...opts, user_id: params.user_id})
    loadTransactionsByUser({...opts, user_id: params.user_id})
  }

  return <div>
    <DavePicker onChange={handleChange} />
    <br/><br/>
    {!props.noSummary === true && <div>
      <h3>Summary</h3>
      <SummaryViewer summary={summary} />
    </div>}
    <h3>Transaction Details</h3>
    <Table hover responsive>
      <thead>
      <SummaryListHeader />
      </thead>
      <tbody>
      {!transactions.length && <tr className="text-center">
        <td colSpan="6">No transactions for this cycle.</td>
      </tr>}
      {transactions.map(transaction => {
        return <TransactionRow key={transaction.id} transaction={transaction} />
      })}
      {!props.noSummary === true && <SummaryRow {...props} />}
      </tbody>
    </Table>
  </div>
}

function SummaryViewer(props) {
  let {summary} = props
  return <Row className="ledger-detail-summary">
    <Col sm={3}>
      <Well>
        <h5>Starting Balance</h5>
        <p>${summary.startingBalance}</p>
      </Well>
    </Col>
    <Col sm={3}>
      <Well>
        <h5>Gross Debits</h5>
        <p>${summary.grossDebits}</p>
      </Well>
    </Col>
    <Col sm={3}>
      <Well>
        <h5>Gross Credits</h5>
        <p>${summary.grossCredits}</p>
      </Well>
    </Col>
    <Col sm={3}>
      <Well>
        <h5>Net Balance</h5>
        <p>${summary.netBalance}</p>
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
    'text-danger': transaction.kind === 'debit',
    'text-success': transaction.kind === 'credit'
  }, 'text-right')
  return <tr>
    <td><Label>
      {transaction.kind.toUpperCase()}
    </Label></td>
    <td className="text-muted">
      {transaction.created_at}
    </td>
    <td className="text-muted">
      {transaction.description ? transaction.description : '<No description provided>'}
    </td>
    <td className={amountClasses}>${transaction.amount}</td>
  </tr>
}

function SummaryRow(props) {
  let { summary } = props
  let style = {verticalAlign: 'middle'}

  return <tr>
    <td />
    <td />
    <td className="text-right"><strong>Total:</strong></td>
    <td style={style} className="text-right"><strong>${summary.netBalance}</strong></td>
  </tr>
}

import Path from 'path'

function imageSize(src, size = '100x') {
  let ext = Path.extname(src)
  let base = src.replace(ext, '')
  return `${base}_${size}${ext}`
}