import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {
  Table,
  Image,
  Button,
  Pagination
} from 'react-bootstrap'
import Grid from '../connectors/grid'
import DatePicker from '../connectors/date-picker'


const layout = [
  {
    key: 'title',
    header: 'Title',
    width: 300,
    isResizable: true
  },
  {
    key: 'vendor',
    header: 'Vendor',
    width: 150,
    isResizable: true
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    flexGrow: true,
    cell(props, item, value) {
      return <div>
        Do stuff
      </div>
    }
  }

]

export default function LedgerList(props) {
  let { summaries, loadSummaries, push, location } = props

  function handleChange(opts) {
    loadSummaries({ startDate: opts.start, endDate: opts.end })
  }

  return <div>
    <DatePicker onChange={handleChange} />
    <br/><br/>
    <Grid
      columns={layout}
    />
  </div>
}

function SummaryListHeader(props) {
  return <tr>
    <th>Creator</th>
    <th>Starting Balance</th>
    <th>Gross Expenses</th>
    <th>Gross Income</th>
    <th>Net Balance</th>
    <th className="text-right">Actions</th>
  </tr>
}

function SummaryRow(props) {
  let { summary } = props
  let style = {verticalAlign: 'middle'}
  let netBalance = parseFloat(summary.netBalance)
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
        <Button>
          Details
        </Button>
      </LinkContainer>
      &nbsp;
      <Button bsStyle="primary" 
              disabled={netBalance <= 0} 
              onClick={e => props.payout(summary.netBalance)}>
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