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
  Button,
  ButtonGroup
} from 'react-bootstrap'

const formSettings = {form: 'settings'}

const mapPropsToState = state => ({
  initialValues: state.settings
})

@connect(mapPropsToState)
@reduxForm(formSettings)
export default class SettingsForm extends Component {

  render() {
    const { invalid, reset, submitting, pristine, handleSubmit } = this.props
    return <Form onSubmit={handleSubmit}>

      <FormGroup>
        <Col smOffset={3} sm={6}>
          <Row>
            <Col xs={6}>
              <Field component={renderField}
                     name="cutoffDate"
                     label="Cutoff Date" />
            </Col>
            <Col xs={6}>
              <Field component={renderField}
                     name="cutoffTime"
                     label="Cutoff Time" />
            </Col>
          </Row>
        </Col>
      </FormGroup>


      <FormGroup>
        <Col smOffset={3} sm={6}>
          <ButtonGroup style={{marginTop: '15px'}}>

            <Button onClick={reset} bsSize="lg" disabled={submitting || pristine}>
              Reset
            </Button>

            <Button type="submit"
                    bsStyle="primary"
                    bsSize="lg"
                    disabled={invalid || submitting || pristine}>
              {submitting ? 'Saving...' : 'Save' }
            </Button>

          </ButtonGroup>
        </Col>
      </FormGroup>
    </Form>
  }
}

function validate(values) {
  const errors = {}
  if (!values.user_id) {
    if (!values.password) {
      errors.password = 'Please specify a password'
    }
    if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = 'Must be equal to password'
    }
  }
  if ((values.app_metadata && !values.app_metadata.role)
        || (values.app_metadata && ['admin', 'creator'].indexOf(values.app_metadata.role) < 0)) {
    errors.role = 'Please specify a valid role'
  }
  if (!values.name) {
    errors.name = 'Please specify a name'
  }
  if (!values.email) {
    errors.email = 'Please specify an email'
  }
  return errors
}
