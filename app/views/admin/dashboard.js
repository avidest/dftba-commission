import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import {asyncConnect} from 'protium'

export default class AdminDashboardView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid>
        <Row>
          <Col xs={12}>
          <h2>Content</h2>
          </Col>
        </Row>
      </Grid>
    </div>
  }
}