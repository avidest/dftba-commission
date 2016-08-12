import React, {Component} from 'react'
import Path from 'path'
import {LinkContainer} from 'protium/router'
import TimeAgo from 'react-timeago'
import DataGrid from './data-grid'
import {
  Table,
  Image,
  Button
} from 'react-bootstrap'

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
    key: 'last_updated',
    header: 'Last Updated',
    width: 150,
    isResizable: true,
    cell(props, item, value) {
      return <TimeAgo data={value} />
    }
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


export default function ProductList(props) {
  let { state, actions } = props
  return <div />
  return <DataGrid
    items={state.list}
    totalItems={state.count}
    selections={state.bulkSelections}
    selectAll={state.bulkSelectAll}
    queryOpts={state.queryOpts}
    layout={layout}
  />
}