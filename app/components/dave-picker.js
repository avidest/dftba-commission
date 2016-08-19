import React, {Component} from 'react'
import Icon from './icon'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {
  Button,
  Dropdown,
  DropdownButton
} from 'react-bootstrap'

const DISPLAY_FORMAT = 'M/D/YY'

export default class DavePicker extends Component {

  state = {
    editing: false
  }

  componentWillMount() {
    let {
      startDate = moment(),
      endDate = moment().add(1, 'month')
    } = this.props
    this.setState({ startDate, endDate })
  }

  open() {
    this.setState({currentState: this.state})
    this.setState({editing: true})
  }

  close() {
    this.setState({editing: false})
  }

  toggle() {
    this.setState({editing: !this.state.editing})
  }

  handleOpen() {
    this.open()
  }

  handleToggle() {
    if (!this.state.editing) {
      this.open()
    }
  }

  handleClose() {
    console.log('close')
  }

  handleCancel() {
    this.setState({...this.state.currentState})
    this.close()
  }

  handleApply() {
    this.props.onChange && this.props.onChange(this.state)
    this.close()
  }

  handleChangeStart(value) {
    this.setState({startDate: value})
  }

  handleChangeEnd(value) {
    this.setState({endDate: value})
  }

  render() {
    return <Dropdown id="dave-picker" 
              open={this.state.editing} 
              onOpen={::this.handleOpen} 
              onClose={::this.handleClose} 
              onToggle={::this.handleToggle}>
      <Dropdown.Toggle>
        {this.state.startDate.format(DISPLAY_FORMAT)}—{this.state.endDate.format(DISPLAY_FORMAT)}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{minWidth: '450px', padding: '5px 5px 5px 6px'}}>
        <div className="input-group">
          <DatePicker 
            dateFormat={DISPLAY_FORMAT}
            selected={this.state.startDate}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            className="form-control" 
            onChange={::this.handleChangeStart} 
          />
          <DatePicker 
            dateFormat={DISPLAY_FORMAT}
            selected={this.state.endDate}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            className="form-control" 
            onChange={::this.handleChangeEnd} 
          />
          <div className="input-group-btn">
            <Button onClick={::this.handleCancel}><Icon type="times" /></Button>
            <Button bsStyle="primary" onClick={::this.handleApply}>Apply</Button>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  }

}