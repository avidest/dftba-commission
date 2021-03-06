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

  let {
    addonBefore,
    addonAfter,
    componentClass,
    input,
    label,
    children,
    rows,
    placeholder,
    withoutGroup
  } = field

  let {
    dirty,
    error,
    invalid,
    pristine,
    touched
  } = field.meta

  if (!pristine && touched && invalid) {
    state = 'error'
  }
  
  if (rows) {
    input.rows = rows
  }

  if (placeholder) {
    input.placeholder = placeholder
  }

  let formControl = <FormControl {...input} 
                      componentClass={componentClass}
                      children={children} />

  if (withoutGroup) {
    return formControl
  }

  if (addonBefore || addonAfter) {
    formControl = <InputGroup>
      {addonBefore && <InputGroup.Addon>{addonBefore}</InputGroup.Addon>}
      {formControl}
      {addonAfter && <InputGroup.Addon>{addonAfter}</InputGroup.Addon>}
    </InputGroup>
  }

  return <FormGroup controlId={input.name} validationState={state}>
    <ControlLabel>{label}</ControlLabel>
    {formControl}
    <FormControl.Feedback />
    {(!pristine && touched && error) && <HelpBlock>{error}</HelpBlock>}
  </FormGroup>
}

export function renderInlineField(field) {
  let state, compClass

  let {
    dirty, 
    invalid, 
    error, 
    pristine,
    touched
  } = field.meta

  let {
    input, 
    label,
    children,
    type,
    componentClass,
    props,
    rows,
    placeholder
  } = field

  if (!pristine && touched && invalid) {
    state = 'error'
  }

  if (type) {
    input.type = type
  }
  
  if (rows) {
    input.rows = rows
  }

  if (placeholder) {
    input.placeholder = placeholder
  }

  return <FormGroup controlId={input.name} validationState={state}>
    <Col componentClass={ControlLabel} sm={3}>
      {type !== 'checkbox' && label}
    </Col>
    <Col sm={6}>
      {type === 'checkbox'
        ? <Checkbox {...input}>{label}</Checkbox>
        : <FormControl {...input} componentClass={componentClass} children={children} /> }
      <FormControl.Feedback />
      {(!pristine && touched && error) && <HelpBlock>{error}</HelpBlock>}
    </Col>
  </FormGroup>
}