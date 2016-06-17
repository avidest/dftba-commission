import React from 'react'
import {Link, LinkContainer} from 'protium/router'
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap'

export default function PageHeader(props) {
  let title = '<untitled>'

  if (props.route && props.route.title) {
    title = props.route.title
  }

  if (props.title) {
    title = props.title
  }

  return <div className="sub-header">
    <Grid>
      <Row>
        <Col xs={12} sm={7} smPush={5}>
          {props.children}
        </Col>
        <Col xs={12} sm={5} smPull={7}>
          <h1>{title}</h1>
        </Col>
      </Row>
    </Grid>
  </div>
}