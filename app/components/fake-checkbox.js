import React, {Component} from 'react'
import Icon from './icon'

export default class FakeCheckbox extends Component {

  state = {
    checked: false
  }

  getType() {
    switch(this.state.checked) {
      case true:
        return 'check-square-o'
      case false:
        return 'square-o'
      case null:
        return 'minus-square-o'
    }
  }

  handleClick() {
    let checked = this.state.checked;
    if (checked) {
      if (this.props.indeterminate) {
        checked = null
      } else {
        checked = false
      }
    } else {
      if (this.props.indeterminate && checked === null) {
        checked = false
      } else {
        checked = true
      }
    }
    this.setState({ checked })
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.state.checked)
    }
  }

  render() {
    return <div onClick={::this.handleClick}>
      <Icon type={this.getType()} />
    </div>
  }
}