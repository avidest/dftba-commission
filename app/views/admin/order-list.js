import React, {Component} from 'react'
import {connect} from 'protium'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import DavePicker from '../../components/dave-picker'

@connect(state => ({users: state.users.list}))
export default class OrderListView extends Component {
  state = { editing: false }
  render() {
    return <div>
      <PageHeader route={this.props.route}>
        <div className="pull-right">
          <Button bsSize="lg">Add Debit</Button>
          &nbsp;
          <Button bsSize="lg">Add Credit</Button>
        </div>
      </PageHeader>
      <Grid>
        <Row>
          <Col xs={12}>
            <DavePicker />
          </Col>
        </Row>
      </Grid>
      {this.props.children}
    </div>
  }
}