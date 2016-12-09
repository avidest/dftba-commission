import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'protium'
import {
  renderField
} from './helpers/render-field'
import {
  Col,
  Row,
  Form,
  FormGroup,
  ControlLabel,
  InputGroup,
  Button,
  ButtonGroup
} from 'react-bootstrap'
import DatePicker from 'react-datepicker'

const formSettings = {form: 'historical-data'}

@reduxForm(formSettings)
export default class HistoricalDataForm extends Component {

  render() {
    const { invalid, reset, submitting, pristine, handleSubmit } = this.props
    return <Form onSubmit={handleSubmit}>
      <Col smOffset={2} sm={8}>
        <h2>Fetch Historical Data</h2>
        <Row>
          <Col xs={6}>
            <ControlLabel>From</ControlLabel>
            <Field type="date" component="input" required name="from" className="form-control" />
          </Col>
          <Col xs={6}>
            <ControlLabel>To</ControlLabel>
            <Field type="date" component="input" required name="to" className="form-control" />
          </Col>
        </Row>
        <br/>
        <br/>
        <Button type="submit"
                bsStyle="primary"
                bsSize="lg"
                disabled={invalid || submitting}>
          {submitting ? 'Fetching...' : 'Fetch' }
        </Button>
      </Col>
    </Form>
  }
}
