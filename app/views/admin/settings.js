import React, {Component} from 'react'
import {connect} from 'protium'
import {Grid, Row, Col} from 'react-bootstrap'
import PageHeader from '../../components/page-header'
import SettingsForm from '../../forms/settings'
import {saveSettings} from '../../ducks/settings'

@connect(state => state, {
  saveSettings
})
export default class SettingsView extends Component {
  render() {
    return <div>
      <PageHeader route={this.props.route} />
      <Grid>
        <Row>
          <Col xs={12}>
            <SettingsForm
              onSubmit={values => {
                return this.props.saveSettings(values)
              }}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  }
}