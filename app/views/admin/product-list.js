import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {asyncConnect} from 'protium'
import PageHeader from '../../components/page-header'
import DataGrid from '../../connectors/grid'
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

@asyncConnect(deps, mapStateToProps)
export default class ProductListView extends Component {

  handleCellClick({record, label, colIndex, rowIndex, event}) {
    console.log(record)
  }

  handleHeaderClick({ label, colIndex, event}) {
    console.log(record)
  }

  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid>
        <Row>
          <Col xs={12}>
            <DataGrid type={GRID_KEY}
              cellStyle={{verticalAlign: 'middle'}}
              onCellClick={::this.handleCellClick}
              onHeaderClick={::this.handleHeaderClick}
              columns={[
                ['', IndexCol],
                ['Title', 'title'],
                ['Vendor', 'vendor'],
                ['Last Updated', UpdatedAt],
                ['Actions', Actions]
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
    ? getSize(record.images[0].src, '40x')
    : 'https://placehold.it/40x40'
  return <Image circle thumbnail src={image} />
}