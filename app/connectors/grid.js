import React, {Component, PropTypes} from 'react'
import {connect, bindActionCreators} from 'protium'
import * as gridActions from '../ducks/grid'
import * as gridSelectors from '../selectors/grid'
import Icon from '../components/icon'
import {
  Table,
  Pagination,
  ButtonGroup,
  Button
} from 'react-bootstrap'
import SearchForm from './grid-search'

const mapStateToProps = (state, props)=> {
  return {
    grid: state.grid[props.type]
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(gridActions, dispatch)
})

const ComponentPrototype = Component.prototype

@connect(mapStateToProps, mapDispatchToProps)
export default class Grid extends Component {

  events = [
    'init',
    'reset',
    'loadAll',
    'loadOne',
    'select',
    'selectAll',
    'setPage',
    'setNextPage',
    'setPrevPage',
    'setQuery'
  ]

  constructor(props) {
    super(props)

    this.events.forEach(event => {
      let eventHandler = `handle${upCase(event)}`
      let propHandler = `on${upCase(event)}`

      this[eventHandler] = (payload) => {
        if (this.props[propHandler]) {
          this.props[propHandler](payload)
        }
        return payload
      }
    })
  }

  handleHeaderClick(opts) {
    if (this.props.onHeaderClick) {
      this.props.onHeaderClick(opts)
    }
  }

  handleCellClick(opts) {
    if (this.props.onCellClick) {
      this.props.onCellClick(opts)
    }
  }

  isNextPageable() {
    let {page, total, limit} = this.props.grid
    return (page * limit) < total
  }

  isPrevPageable() {
    return this.props.grid.page > 1;
  }

  getColumnHeader(index) {
    let {columns} = this.props
    return columns[index][0]
  }

  getColumnDatum(record, rowIndex, colIndex) {
    let {columns} = this.props
    let Selector = columns[colIndex][1]
    if (typeof Selector === 'function' || ComponentPrototype.isPrototypeOf(Selector)) {
      return <Selector {...{record, rowIndex, colIndex}} />
    }
    return record[Selector]
  }

  isAllSelected() {
    let {grid} = this.props
    return grid.data && grid.data.length === grid.selected.length
  }

  isSelected(rowIndex) {
    let {grid} = this.props
    if (grid && grid.data && grid.data.length || this.isAllSelected()) {
      if (grid.selected.indexOf(rowIndex) > -1) {
        return true;
      }
    }
    return false;
  }

  renderHeader(records) {
    return <thead>
      <tr>
        {this.props.selectable && <th style={this.props.cellStyle}>
          <SelectAll
            grid={this.props.grid}
            checked={this.isAllSelected()}
            onChange={::this.handleSelectAll}
          />
        </th>}
        {this.props.columns.map((col, colIndex) => {
          let label = this.getColumnHeader(colIndex)
          return <th style={this.props.cellStyle}
                     key={`header-cell-${colIndex}`} onClick={event => this.handleHeaderClick({
                        label,
                        rowIndex,
                        event
                      })}>{label}</th>
        })}
      </tr>
    </thead>
  }

  renderRow(record, rowIndex) {
    return <tr key={`row-${rowIndex}`}>
      {this.props.selectable && <td style={this.props.cellStyle}>
        <Selector
          record={record}
          rowIndex={rowIndex}
          grid={this.props.grid}
          checked={this.isSelected(rowIndex)}
          onChange={value => {
            this.handleSelect(rowIndex)
          }}
        />
      </td>}
      {this.props.columns.map((col, colIndex)=> {
        let label = this.getColumnHeader(colIndex)
        let datum = this.getColumnDatum(record, rowIndex, colIndex)
        return <td style={this.props.cellStyle}
                   key={`cell-${rowIndex}-${colIndex}`}
                   onClick={event => this.handleCellClick({
                     record,
                     rowIndex,
                     colIndex,
                     event,
                     label
                   })}>{datum}</td>
      })}
    </tr>
  }

  renderBody(records) {
    return <tbody className="data-grid-body">
      {records.map((record, rowIndex) => {
        return this.renderRow(record, rowIndex)
      })}
    </tbody>
  }

  render() {
    const {
      header,
      grid,
      tableProps
    } = this.props

    if (!grid) {
      return <div/>
    }

    return <div className="data-grid">
      <TableHeader {...this.props} gridInstance={this} />
      <Table {...tableProps}>
        {header && this.renderHeader(grid.data)}
        {this.renderBody(grid.data)}
      </Table>
      <TableFooter {...this.props} gridInstance={this} />
    </div>
  }

  static propTypes = {
    tableProps: PropTypes.object,
    header: PropTypes.bool,
    cellStyle: PropTypes.object,
    columns: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    onSetPage: PropTypes.func,
    onNextPage: PropTypes.func,
    onPrevPage: PropTypes.func,
    onSearch: PropTypes.func
  }

  static defaultProps = {
    tableProps: {responsive: true, condensed: true, hover: true},
    header: true,
    cellStyle: {},
    columns: [],
    selectable: false
  }
}

function TableHeader(props) {
  let minRange = (props.grid.page === 0 || props.grid.page === 1)
                    ? 1
                    : (props.grid.limit * (props.grid.page - 1)) + 1

  let maxRange = ((minRange + props.grid.limit) > props.grid.total)
                              ? (props.grid.total)
                              : props.grid.limit * props.grid.page

  let grid = props.gridInstance;

  return <div className="clearfix data-grid-header">
    <div className="pull-left">
      <SearchForm value={props.grid.query} onSearch={::grid.handleSetQuery} />
    </div>
    <div className="pull-right">
      <small className="count">
        Viewing {minRange}-{maxRange} / {props.grid.total}&nbsp;
      </small>
      <ButtonGroup>
        <Button disabled={!grid.isPrevPageable()} onClick={e => grid.handleSetPrevPage(props.grid.page - 1)}>
          <Icon type="chevron-left" />
        </Button>
        <Button disabled={!grid.isNextPageable()} onClick={e => grid.handleSetNextPage(props.grid.page + 1)}>
          <Icon type="chevron-right" />
        </Button>
      </ButtonGroup>
    </div>
  </div>
}


function TableFooter(props) {
  return <div className="data-grid-footer">
    <div className="text-center">
      <Pagination 
        items={Math.ceil(props.grid.total / props.grid.limit)}
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        maxButtons={7}
        onSelect={props.gridInstance.handleSetPage}
        activePage={props.grid.page}
      />
    </div>
  </div>
}

import classNames from 'classnames'
function CustomChecker(props) {
  const classes = classNames('selector', {
    'selector-checked': props.checked
  })

  return <div className={classes} onClick={e => props.onChange(!props.checked)}>
    {props.checked ? <Icon type="check" /> : ' '}
  </div>
}

function SelectAll(props) {
  return <CustomChecker {...props} />
}

function Selector(props) {
  return <CustomChecker {...props} />
}

// Helpers

function upCase(str) {
  return str[0].toUpperCase() + str.slice(1)
}
