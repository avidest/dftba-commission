import React, {Component}         from 'react'
import classnames                 from 'classnames'
import {wrap as calculateBounds}  from 'react-bounds-deux'
import Icon                       from './icon'
import FakeCheckbox               from './fake-checkbox'
import {
  Table,
  Column,
  Cell
} from 'fixed-data-table-2'

import {
  Row,
  Col,
  Button,
  ButtonToolbar,
  ButtonGroup,
  FormControl,
  FormGroup,
  InputGroup,
  ControlLabel,
  Pagination,
  DropdownButton,
  MenuItem
} from 'react-bootstrap'

export default function DataGrid(props) {
  let {state, actions} = props
  return <div>
    <DataGridHeader {...state} />
    <DataTable {...state} />
    <DataGridFooter {...state} />
  </div>
}


@calculateBounds
class DataTable extends Component {

  static defaultProps = {
    items: [],
    totalItems: null,
    selections: [],
    selectAll: false,
    queryOpts: {},
    rowHeight: 50,
    height: 650,
    width: 1000
  }

  getDataItem(items, index, key) {
    if (items[index][key]) {
      return items[index][key]
    }
    return items[index]
  }

  renderColumns(layout, items) {
    return layout.map(column => {
      let customCell = typeof column.cell === 'function'
      let cell = customCell
        ? (props) => <CustomCell {...props} dfn={column.cell} />
        : (props) => <Cell/>
      return <Column
        key={column.key || column.columnKey}
        columnKey={column.key || column.columnKey}
        width={column.width || 200}
        header={column.header}
        cell={cell}
      />
    })
  }

  renderSelectAllButton(props) {
    let {width, height, ...p} = props
    let type = this.state.selectAll ? 'check-square-o' : 'square-o'
    return <ButtonToolbar {...{width, height}}>
      <ButtonGroup >
        <Button bsSize="sm" onClick={e => this.setState({selectAll: !this.state.selectAll})}>
          <Icon type={type} />
          {' '}
          {this.state.selectAll
            ? <span>50 products selected</span>
            : <Icon type="caret-down" />}
        </Button>

        {this.state.selectAll && <DropdownButton bsSize="sm" title="Bulk Actions" id="dropdown-bulk-actions">
          <MenuItem eventKey="1">Add Commission Split</MenuItem>
        </DropdownButton>}
      </ButtonGroup>

      {this.state.selectAll && <div className="bulk-selection-select-complete">
        All products on this page have been selected. <a href="#">Select all 50+ products from your store</a>
      </div>}
    </ButtonToolbar>
  }

  renderBulkSelectionColumn(items) {
    return <Column
      key="bulk-select"
      width={60}
      header={::this.renderSelectAllButton}
      cell={props => {
        return <Cell>
          <FakeCheckbox />
        </Cell>
      }}
    />
  }

  render() {
    let {
      items,
      totalItems,
      selections,
      selectAll,
      queryOpts,
      rowHeight,
      height,
      width,
      layout,
      className
    } = this.props

    let classes = classnames({
      'data-grid-select-all': this.state.selectAll
    }, className)

    return <Table
      items={items}
      className={classes}
      headerHeight={rowHeight}
      rowsCount={items.length}
      rowHeight={rowHeight}
      width={width}
      height={height}>
      {this.renderBulkSelectionColumn(items)}
      {this.renderColumns(layout, items)}
    </Table>
  }
}

function DataGridHeader(props) {
  return <FormGroup id="data-grid-search">
    <InputGroup>
      <InputGroup.Button>
        <Button>
          Reset Filters
        </Button>
      </InputGroup.Button>
      <FormControl type="search" />
      <InputGroup.Button>
        <Button bsStyle="primary">
          <Icon type="search" />
        </Button>
      </InputGroup.Button>
    </InputGroup>
  </FormGroup>
}

function DataGridFooter(props) {
  return <div className="text-center">
    <Pagination
      prev
      next
      first
      last
      ellipsis
      boundaryLinks
      items={20}
      maxButtons={7}
      activePage={3}
      onSelect={function() {}} />
  </div>
}
