import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../components/page-header'
import UsersDetailForm from '../forms/users-detail'
// console.log(UsersDetailForm)
export default class UsersDetail extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route}>
        <ButtonGroup className="pull-right">
          <LinkContainer to="/users">
            <Button>Back</Button>
          </LinkContainer>
          <Button>Save</Button>
        </ButtonGroup>
      </PageHeader>
      <Grid>
        <Row>
          <Col xs={12}>
            <UsersDetailForm />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}
