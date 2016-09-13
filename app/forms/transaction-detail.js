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
import moment from 'moment'

const formSettings = {
  enableReinitialize: true,
  destroyOnUnmount: false,
  form: 'transaction-detail',
  validate
}

@connect((state, props) => {
  var map = {
    users: state.users.creators,
    initialValues: {
      kind: props.type,
      ...props.params
    }
  }
  if (props.params.payout) {
    map.initialValues.description = `Payout for cycle ending ${moment(props.params.created_at).format(`ll`)}`
  }
  return map
}, null, null, {withRef: true})
@reduxForm(formSettings)
export default class ProductDetailForm extends Component {
  render() {
    const { invalid, reset, submitting, pristine, handleSubmit, users } = this.props

    return <Form onSubmit={handleSubmit}>

      <Field component="input" type="hidden" name="kind" />
      <Field component="input" type="hidden" name="payout" />
      <Field component="input" type="hidden" name="created_at" />

      <Row>
        <Col xs={7}>
          <Field component={renderField} name="user_id" label="Creator" componentClass="select">
            <option value="-1">Choose one...</option>
            {users.map(user => {
              return <option key={user.user_id} value={user.user_id}>
                {user.user_metadata ? user.user_metadata.name : user.email}
              </option>
            })}
          </Field>
        </Col>
        <Col xs={5}>
          <Field component={renderField}
                 name="amount"
                 label="Amount"
                 type="number"
                 addonBefore={this.props.type === 'debit' ? '- $' : '+ $'}
                 placeholder="0.00"
          />
        </Col>
      </Row>


      <Row>
        <Col xs={12}>
          <Field component={renderField}
                 name="description"
                 label="Description"
                 type="textarea"
                 componentClass="textarea"
                 props={{rows: 4}}
          />
        </Col>
      </Row>

      {!this.props.noSubmit && <ButtonGroup style={{marginTop: '15px'}} className="pull-right">
        <Button onClick={reset} bsSize="lg" disabled={submitting || pristine}>
          Reset
        </Button>
        <Button type="submit" bsStyle="primary" bsSize="lg" disabled={invalid || submitting || pristine}>
          {submitting ? 'Adding...' : 'Add' }
        </Button>
      </ButtonGroup>}
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
    if (values[field] === undefined || values[field] === null) {
      errors[field] = 'This field is required.'
    }
  })

  if (values.flat && !/[0-9\.]/.test(values.flat.toString())) {
    errors.flat = 'This field must contain a numerical value.'
  }

  if (values.percent && !/[0-9\.]/.test(values.percent.toString(2))) {
    errors.percent = 'This field must contain a numerical value.'
  }

  return errors
}
