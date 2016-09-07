import React, {Component} from 'react'
import Icon from './icon'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {
  Button,
  Dropdown,
  DropdownButton,
  FormGroup,
  FormControl,
  InputGroup,
  ControlLabel,
  MenuItem
} from 'react-bootstrap'
import { getCurrentCycle, getLastNCycles } from '../../lib/cycle'

const DISPLAY_FORMAT = 'M/D/YY HH:mm:ss ZZ'

export default class DavePicker extends Component {

  state = {
    editing: false
  };

  static defaultProps = {
    cycleTime: moment().toString()
  };

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
    // this.close()
  }

  handleCancel() {
    this.close()
    this.setState({...this.state.currentState})
  }

  apply() {
    this.close()
    process.nextTick(x => {
      this.props.onChange && this.props.onChange(this.state)
    })
  }

  handleApply() {
    this.apply()
  }

  handleChangeStart(value) {
    this.setState({startDate: value})
  }

  handleChangeEnd(value) {
    this.setState({endDate: value})
  }

  handleApplyPeriod(start, end) {
    this.setState({
      startDate: start,
      endDate: end
    })
    this.apply()
  }

  renderCycles() {
    return getLastNCycles(12, this.props).map((cycle, k) => {
      let {start, end} = cycle
      return <MenuItem key={k} onClick={this.handleApplyPeriod.bind(this, start, end)}>
        {k === 0 && 'Current Cycle'}
        {k > 0 && displayDate(start, end)}
      </MenuItem>
    })
  }

  render() {
    let currentCycle = getCurrentCycle(this.props)
    let {start, end} = currentCycle

    return <Dropdown id="dave-picker" 
              open={this.state.editing} 
              onOpen={::this.handleOpen} 
              onClose={::this.handleClose} 
              onToggle={::this.handleToggle}>
      <Dropdown.Toggle>
        {displayDate(start, end)}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {this.renderCycles()}
        <MenuItem divider />

        <div className="input-group">
          <DatePicker 
            dateFormat={DISPLAY_FORMAT}
            selected={start}
            startDate={start}
            endDate={end}
            className="form-control" 
            onChange={::this.handleChangeStart} 
          />
          <DatePicker 
            dateFormat={DISPLAY_FORMAT}
            selected={end}
            startDate={start}
            endDate={end}
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


function displayDate(start, end) {
  return `${start.format(DISPLAY_FORMAT)}—${end.format(DISPLAY_FORMAT)}`
}
