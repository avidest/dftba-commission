import React, {Component} from 'react'
import {connect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'

@connect(state => ({users: state.users.list}))
export default class ProductDetailView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid>
        <Row>
          <Col xs={12}>
          content
          </Col>
        </Row>
      </Grid>
    </div>
  }
}