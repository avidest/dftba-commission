import React from 'react'
import {Link, LinkContainer} from 'protium/router'
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap'

export default function PageHeader(props) {
  return <div className="sub-header">
    <Grid>
      <Row>
        <Col xs={4}>
          <h1>{props.route.title || "<untitled>"}</h1>
        </Col>
        <Col xs={8}>
          {props.children}
        </Col>
      </Row>
    </Grid>
  </div>
}