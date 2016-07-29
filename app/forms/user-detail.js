import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'protium'
import {
  renderInlineField
} from './helpers/render-field'
import {
  Col,
  Form,
  FormGroup,
  Button,
  ButtonGroup
} from 'react-bootstrap'

const formSettings = {form: 'user-detail', validate}
const mapPropsToState = (state, props, params) => {
  if (state.routing.locationBeforeTransitions.pathname.match(/create|profile/i)) {
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
      <Field component={renderInlineField} name="user_metadata.name" label="Name" />
      <Field component={renderInlineField} name="email" label="Email" type="email" />
      {!this.props.profile && <div>
        <Field component={renderInlineField} name="app_metadata.role" label="Role" componentClass="select">
          <option value="-1">Choose one...</option>
          <option value="admin">Admin</option>
          <option value="creator">Creator</option>
        </Field>
        <Field component={renderInlineField} name="email_verified" label="Email Verified" type="checkbox" />
      </div>}
      <hr/>
      <Field component={renderInlineField} name="password" label="Password" type="password" />
      <Field component={renderInlineField} name="passwordConfirm" label="Confirm Password" type="password" />
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
