import React, {Component} from 'react'
import {LinkContainer} from 'protium/router'
import {Grid, Row, Col, ButtonGroup, Button} from 'react-bootstrap'
import PageHeader from '../components/page-header'
import UsersDetailForm from '../forms/users-detail'
// console.log(UsersDetailForm)
export default class UsersDetail extends Component {
  handleSave() {
    return this.refs.usersDetailForm.submit()
  }

  getTitle() {
    return this.props.params.id.toLowerCase() === 'create' ? 'Create User' : 'Edit User'
  }

  render() {
    return <div>
      <PageHeader title={this.getTitle()}>
        <ButtonGroup className="pull-right">
          <LinkContainer to="/users">
            <Button>Back</Button>
          </LinkContainer>
          <Button bsStyle="primary" onClick={::this.handleSave}>
            Save
          </Button>
        </ButtonGroup>
      </PageHeader>
      <Grid>
        <Row>
          <Col xs={12}>
            <UsersDetailForm ref="usersDetailForm" />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}
