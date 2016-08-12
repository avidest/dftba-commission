import React, {Component}   from 'react'
import {Grid, Row, Col, Button}     from 'react-bootstrap'
import {connect}            from 'protium'
import {Link, LinkContainer} from 'protium/router'
import {login}              from '../ducks/users'
import PageHeader           from '../components/page-header'

@connect(state => ({ token: state.users.token }), { login })
export default class HomeView extends Component {

  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid>
        <Row>
          <Col xs={12} sm={4} smPush={4} className="text-center">
            {!this.props.token && <Button bsSize="lg" bsStyle="primary" onClick={this.props.login}>
                Login
            </Button>}
          </Col>
        </Row>
      </Grid>
    </div>
  }
}