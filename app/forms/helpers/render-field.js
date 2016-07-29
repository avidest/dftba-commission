import React from 'react'
import {
  FormGroup,
  InputGroup,
  FormControl,
  Col,
  ControlLabel,
  Checkbox,
  Radio,
  HelpBlock
} from 'react-bootstrap'

export function renderField(field) {
  let state, compClass

  if (field.dirty && field.invalid) {
    state = 'error'
  }

  let {
    addonBefore,
    addonAfter,
    ...input
  } = field.input

  let formControl = <FormControl {...input} />

  if (addonBefore || addonAfter) {
    formControl = <InputGroup>
      {addonBefore && <InputGroup.Addon>{addonBefore}</InputGroup.Addon>}
      {formControl}
      {addonAfter && <InputGroup.Addon>{addonAfter}</InputGroup.Addon>}
    </InputGroup>
  }

  return <FormGroup controlId={field.input.name} validationState={state}>
    <ControlLabel>{field.input.label}</ControlLabel>
    {formControl}
    <FormControl.Feedback />
    {field.dirty && field.error && <HelpBlock>{field.error}</HelpBlock>}
  </FormGroup>
}

export function renderInlineField(field) {
  let state, compClass

  if (field.dirty && field.invalid) {
    state = 'error'
  }

  return <FormGroup controlId={field.input.name} validationState={state}>
    <Col componentClass={ControlLabel} sm={3}>
      {field.input.type !== 'checkbox' && field.input.label}
    </Col>
    <Col sm={6}>
      {field.input.type === 'checkbox'
        ? <Checkbox {...field.input}>{field.input.label}</Checkbox>
        : <FormControl {...field.input} /> }
      <FormControl.Feedback />
      {field.dirty && field.error && <HelpBlock>{field.error}</HelpBlock>}
    </Col>
  </FormGroup>
}