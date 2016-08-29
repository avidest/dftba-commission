import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Table,
  Image,
  Button,
  Pagination
} from 'react-bootstrap'
import DavePicker from './dave-picker'

export default function LedgerList(props) {
  let { summaries, loadSummaries, push, location } = props

  function handleChange(opts) {
    loadSummaries(opts)
  }

  return <div>
    <DavePicker onChange={handleChange} />
    <br/><br/>
    <Table hover responsive>
      <thead>
        <SummaryListHeader />
      </thead>
      <tbody>
      {!summaries.length && <tr className="text-center">
        <td colSpan="6">No transactions for this cycle.</td>
      </tr>}
        {summaries.map(summary => {
          return <SummaryRow key={summary.user_id} summary={summary} />
        })}
      </tbody>
    </Table>
  </div>
}

function SummaryListHeader(props) {
  return <tr>
    <th>Creator</th>
    <th>Starting Balance</th>
    <th>Gross Expenses</th>
    <th>Gross Credits</th>
    <th>Net Balance</th>
    <th className="text-right">Actions</th>
  </tr>
}

function SummaryRow(props) {
  let { summary } = props
  let style = {verticalAlign: 'middle'}

  return <tr>
    <td style={style}>
      <Image style={{maxWidth: '20px', backgroundSize: 'cover'}}
             src={summary.user.picture}
             circle
             thumbnail />
      &nbsp;{summary.user.name}
    </td>
    <td style={style}>{summary.startingBalance}</td>
    <td style={style} className="text-danger">{summary.grossDebits}</td>
    <td style={style} className="text-success">{summary.grossCredits}</td>
    <td style={style}>{summary.netBalance}</td>
    <td style={style} className="text-right">
      <LinkContainer to={`/admin/ledger/${summary.user.user_id}`}>
        <Button bsSize="xs">
          Details
        </Button>
      </LinkContainer>
      &nbsp;
      <Button bsSize="xs" bsStyle="primary">
        Pay Out
      </Button>
    </td>
  </tr>
}

import Path from 'path'

function imageSize(src, size = '100x') {
  let ext = Path.extname(src)
  let base = src.replace(ext, '')
  return `${base}_${size}${ext}`
}