import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import {asyncConnect} from 'protium'

export default class CreatorDashboardView extends Component {
  render() {
    console.log(this.props)
    let name = this.props.profile.user_metadata.name || this.props.profile.email
    return <div>
      <PageHeader title={`Welcome, ${name.split(' ')[0]}!`} />
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