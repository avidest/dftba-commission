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

const formSettings = {
  enableReinitialize: true,
  destroyOnUnmount: false,
  form: 'user-detail',
  validate
}
const mapPropsToState = (state, props, params) => {
  var {params, location: {pathname}} = props
  var map = { current_user: state.users.profile }
  if (!pathname.match(/create/i)) {
    map.initialValues = state.users.selected
  }
  if (pathname.match(/profile/i)) {
    map.initialValues = state.users.profile
  }
  
  return map
}

@connect(mapPropsToState)
@reduxForm(formSettings)
export default class UsersDetailForm extends Component {

  isSameUser() {
    if (!this.props.initialValues) {
      return false;
    }
    return this.props.initialValues.user_id === this.props.current_user.user_id;
  }

  render() {
    const { invalid, reset, submitting, pristine, handleSubmit } = this.props
    return <Form horizontal onSubmit={handleSubmit}>

      <Field component="hidden" name="user_id" />
      <Field component={renderInlineField}
             name="user_metadata.name"
             label="Name" />
      <Field component={renderInlineField}
             name="email" label="Email"
             type="email" />

      {!this.props.profile && <div>
        <Field component={renderInlineField}
               name="app_metadata.role"
               label="Role"
               componentClass="select"
               disabled={this.isSameUser()}>
          <option value="-1">Choose one...</option>
          <option value="admin">Admin</option>
          <option value="creator">Creator</option>
        </Field>

        <Field component={renderInlineField}
               name="email_verified"
               label="Email Verified"
               type="checkbox" />
      </div>}

      <hr/>

      <Field component={renderInlineField}
             name="password"
             label="Password"
             type="password" />

      <Field component={renderInlineField}
             name="passwordConfirm"
             label="Confirm Password"
             type="password" />

      <hr/>

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

function validate(values = {}) {
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
