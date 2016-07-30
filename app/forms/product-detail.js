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
  InputGroup,
  Button,
  ButtonGroup
} from 'react-bootstrap'

const formSettings = {
  form: 'product-detail',
  validate
}

@connect(state => ({
  users: state.users.creators,
  product: state.products.selected,
  initialValues: {
    product_id: state.products.selected.id
  }
}))
@reduxForm(formSettings)
export default class ProductDetailForm extends Component {
  render() {
    const { invalid, reset, submitting, pristine, handleSubmit, users, product } = this.props

    return <Form onSubmit={handleSubmit}>

      <Field component="input" type="hidden" name="product_id" />

      <Field component={renderField} name="user_id" label="Creator" componentClass="select">
        <option value="-1">Choose one...</option>
        {users.map(user => {
          return <option key={user.user_id} value={user.user_id}>
            {user.user_metadata ? user.user_metadata.name : user.email}
          </option>
        })}
      </Field>

      <Row>
        <Col xs={6}>
          <Field component={renderField}
                 name="percent"
                 label="Commission Percentage"
                 type="decimal"
                 addonBefore="%"
          />
        </Col>
        <Col xs={6}>
          <Field component={renderField}
                 name="flat"
                 label="Commission Flat Fee"
                 type="decimal"
                 addonBefore="$"
          />
        </Col>
      </Row>

      <ButtonGroup style={{marginTop: '15px'}} className="pull-right">
        <Button onClick={reset} bsSize="lg" disabled={submitting || pristine}>
          Reset
        </Button>
        <Button type="submit" bsStyle="primary" bsSize="lg" disabled={invalid || submitting || pristine}>
          {submitting ? 'Adding...' : 'Add' }
        </Button>
      </ButtonGroup>
    </Form>
  }
}

function validate(values) {
  const errors = {}
  const required = [
    'user_id',
    'percent',
    'flat'
  ]

  required.forEach(field => {
    if (!values[field]) {
      errors[field] = 'This field is required.'
    }
  })

  if (values.flat && !values.flat.match(/[0-9\.]/)) {
    errors.flat = 'This field must contain a numerical value.'
  }

  if (values.percent && !values.percent.match(/[0-9\.]/)) {
    errors.percent = 'This field must contain a numerical value.'
  }

  return errors
}
