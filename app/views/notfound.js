import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import PageHeader from '../components/page-header'

export default class NotFoundView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid fluid>
        <Row>
          <Col xs={12} className="text-center">
            <img src="/assets/images/404.gif" />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}