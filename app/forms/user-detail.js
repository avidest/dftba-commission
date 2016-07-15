import React, {Component} from 'react'
import { reduxForm } from 'redux-form'
import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  ButtonGroup,
  Checkbox
} from 'react-bootstrap'

export const fields = [
  'id',
  'name',
  'email',
  'role',
  'sendInvite',
  'unsafePassword',
  'unsafeConfirmPassword'
]

export class UsersDetailForm extends Component {
  render() {
    const {
      fields: {
        id,
        name,
        email,
        role,
        sendInvite,
        unsafePassword,
        unsafeConfirmPassword
      },
      handleSubmit,
      resetForm,
      submitting
    } = this.props
    return <Form horizontal onSubmit={handleSubmit}>
      <input type="hidden" {...id} />

      <FormGroup controlId="userName">
        <Col componentClass={ControlLabel} sm={3}>
          Name
        </Col>
        <Col sm={6}>
          <FormControl type="name" placeholder="Name" {...name} />
        </Col>
      </FormGroup>

      <FormGroup controlId="userEmail">
        <Col componentClass={ControlLabel} sm={3}>
          Email
        </Col>
        <Col sm={6}>
          <FormControl type="email" placeholder="Email" {...email} />
        </Col>
      </FormGroup>

      <FormGroup controlId="userRole">
        <Col componentClass={ControlLabel} sm={3}>
          Role
        </Col>
        <Col sm={6}>
          <FormControl componentClass="select" {...role}>
            <option value="creator">Creator</option>
            <option value="admin">Admin</option>
          </FormControl>
        </Col>
      </FormGroup>

      <hr/>

      <FormGroup controlId="userPassword">
        <Col componentClass={ControlLabel} sm={3}>
          Password
        </Col>
        <Col sm={6}>
          <FormControl type="password" {...unsafePassword} />
        </Col>
      </FormGroup>

      <FormGroup controlId="userConfirmPassword">
        <Col componentClass={ControlLabel} sm={3}>
          Confirm Password
        </Col>
        <Col sm={6}>
          <FormControl type="password" {...unsafeConfirmPassword} />
        </Col>
      </FormGroup>
      
      <hr/>

      <FormGroup>
        <Col smOffset={3} sm={6}>
          <ButtonGroup style={{marginTop: '15px'}}>
            <Button onClick={resetForm} bsSize="lg">
              Reset
            </Button>
            <Button type="submit" bsStyle="primary" bsSize="lg" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save' }
            </Button>
          </ButtonGroup>
        </Col>
      </FormGroup>
    </Form>
  }
}

export default reduxForm(
  { form: 'user-detail', fields },
  state => ({ initialValues: state.users.selected })
)(UsersDetailForm)