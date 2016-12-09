import React, {Component} from 'react'
import {connect} from 'protium'
import {Grid, Row, Col} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import SettingsForm from '../../forms/settings'
import HistoricalDataForm from '../../forms/historical-data'
import {saveSettings, fetchHistoricalData} from '../../ducks/settings'

@connect(state => state, {
  saveSettings,
  fetchHistoricalData
})
export default class SettingsView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <SettingsForm
              onSubmit={values => {
                return this.props.saveSettings(values)
              }}
            />
          </Col>
        </Row>
        <Row style={{marginTop: '2em'}}>
          <Col xs={12}>
            <HistoricalDataForm
              onSubmit={values => {
                return this.props.fetchHistoricalData(values)
              }}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}