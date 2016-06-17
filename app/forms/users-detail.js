import React, {Component} from 'react'
import { reduxForm } from 'redux-form'
import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'react-bootstrap'

export const fields = ['name', 'email', 'id']

export class UsersDetailForm extends Component {
  render() {
    const {
      fields: {
        name,
        email,
        id
      },
      handleSubmit,
      resetForm,
      submitting
    } = this.props
    return <Form horizontal>
      <input type="hidden" {...id} />
      <FormGroup controlId="userEmail">
        <Col componentClass={ControlLabel} sm={2}>
          Name
        </Col>
        <Col sm={5}>
          <FormControl type="name" placeholder="Name" {...name} />
        </Col>
      </FormGroup>
      <FormGroup controlId="userEmail">
        <Col componentClass={ControlLabel} sm={2}>
          Email
        </Col>
        <Col sm={5}>
          <FormControl type="email" placeholder="Email" {...email} />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col smOffset={2} sm={5}>
          <Button type="submit">
            Save
          </Button>
        </Col>
      </FormGroup>
    </Form>
  }
}

export default reduxForm({
  form: 'user-detail',
  fields
})(UsersDetailForm)