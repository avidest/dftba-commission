import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../components/page-header'

export default class UsersList extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route}>
        <ButtonGroup className="pull-right">
          <LinkContainer to="/users/create">
            <Button>Add User</Button>
          </LinkContainer>
        </ButtonGroup>
      </PageHeader>
      <Grid>
        <Row>
          <Col xs={12}>

          </Col>
        </Row>
      </Grid>
    </div>
  }
}