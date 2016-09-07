import React, {Component} from 'react'
import {connect} from 'protium'
import DavePicker from '../components/dave-picker'

const mapStateToProps = state => ({
  cycleTime: state.settings.cycleTime
})

@connect(mapStateToProps)
export default class DatePickerContainer extends Component {
  render() {
    return <DavePicker {...this.props} />
  }
}