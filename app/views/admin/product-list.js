import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {asyncConnect, bindActionCreators} from 'protium'
import PageHeader from '../../components/page-header'
import DataGrid from '../../connectors/grid'
import debounce from 'lodash/debounce'
import {getSize} from '../../components/helpers/images'
import * as gridActions from '../../ducks/grid'
import * as productActions from '../../ducks/products'
import {
  Grid,
  Row,
  Col,
  Button,
  Image
} from 'react-bootstrap'

const {GRID_KEY} = productActions

const deps = [{
  promise({store: {getState, dispatch}}) {
    if (!getState().grid[GRID_KEY]) {
      dispatch(gridActions.init(null, GRID_KEY))
    }

    if (!getState().grid[GRID_KEY].data.length) {
      return dispatch(productActions.loadProducts())
    }
  }
}]

const mapStateToProps = state => ({
  productsGrid: state.grid[GRID_KEY]
})

const mapDispatchToProps = dispatch => ({
  grid: bindActionCreators(gridActions, dispatch),
  products: bindActionCreators(productActions, dispatch)
})

@asyncConnect(deps, mapStateToProps, mapDispatchToProps)
export default class ProductListView extends Component {

  constructor(props) {
    super(props)
    this.loadProducts = debounce(this.props.products.loadProducts, 400)
  }

  handleCellClick({record, label, colIndex, rowIndex, event}) {
    console.log(record)
  }

  handleHeaderClick({ label, colIndex, event}) {
    console.log(record)
  }

  handleSetQuery(query) {
    this.props.grid.setPage(1, GRID_KEY)
    this.props.grid.setQuery(query, GRID_KEY)
    this.loadProducts({ withGrid: true })
  }

  handleSetPage(page) {
    this.props.grid.setPage(page, GRID_KEY)
    this.props.products.loadProducts({ withGrid: true })
  }

  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <DataGrid type={GRID_KEY}
              cellStyle={{verticalAlign: 'middle'}}
              onCellClick={::this.handleCellClick}
              onHeaderClick={::this.handleHeaderClick}
              onSetNextPage={::this.handleSetPage}
              onSetPrevPage={::this.handleSetPage}
              onSetPage={::this.handleSetPage}
              onSetQuery={::this.handleSetQuery}
              columns={[
                ['', IndexCol],
                ['Title', 'title'],
                ['Vendor', 'vendor'],
                ['Last Updated', UpdatedAt],
                ['Actions', Actions, {className: 'text-right'}]
              ]}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}


function Actions({record, colIndex, rowIndex}) {
  return <LinkContainer to={`/admin/products/${record.id}`}>
    <Button>Edit</Button>
  </LinkContainer>
}

import TimeAgo from 'react-timeago'
function UpdatedAt({record, colIndex, rowIndex}) {
  return <TimeAgo date={record.updated_at} />
}

function IndexCol({record, colIndex, rowIndex}) {
  let image = record.images.length
    ? getSize(record.images[0].src, '30x')
    : 'https://placehold.it/30x30'
  return <Image circle src={image} style={{maxWidth: '30px'}} />
}