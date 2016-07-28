import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'protium'
import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  ButtonGroup,
  Checkbox,
  HelpBlock,
  Alert
} from 'react-bootstrap'

const formSettings = {form: 'user-detail', validate}
const mapPropsToState = (state, props, params) => {
  if (state.routing.locationBeforeTransitions.pathname.indexOf('create') < 0) {
    return { initialValues: state.users.selected }
  }
  return {}
}

@connect(mapPropsToState)
@reduxForm(formSettings)
export default class UsersDetailForm extends Component {
  render() {
    const { invalid, reset, submitting, pristine, handleSubmit } = this.props
    return <Form horizontal onSubmit={handleSubmit}>
      <Field component="hidden" name="user_id" />
      <Field component={renderComponent} name="user_metadata.name" label="Name" />
      <Field component={renderComponent} name="email" label="Email" type="email" />
      <Field component={renderComponent} name="app_metadata.role" label="Role" componentClass="select">
        <option value="-1">Choose one...</option>
        <option value="admin">Admin</option>
        <option value="creator">Creator</option>
      </Field>
      <hr/>
      <Field component={renderComponent} name="password" label="Password" type="password" />
      <Field component={renderComponent} name="passwordConfirm" label="Confirm Password" type="password" />
      <hr/>
      <FormGroup>
        <Col smOffset={3} sm={6}>
          <ButtonGroup style={{marginTop: '15px'}}>
            <Button onClick={reset} bsSize="lg" disabled={submitting || pristine}>
              Reset
            </Button>
            <Button type="submit" bsStyle="primary" bsSize="lg" disabled={invalid || submitting || pristine}>
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

function renderComponent(field) {
  let state, compClass

  if (field.dirty && field.invalid) {
    state = 'error'
  }

  return <FormGroup controlId={field.input.name} validationState={state}>
    <Col componentClass={ControlLabel} sm={3}>
      {field.input.label}
    </Col>
    <Col sm={6}>
      <FormControl {...field.input} />
      <FormControl.Feedback />
      {field.dirty && field.error && <HelpBlock>{field.error}</HelpBlock>}
    </Col>
  </FormGroup>
}