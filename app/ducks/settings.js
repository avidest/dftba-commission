import {createAction, handleActions} from 'protium'
import {successNotification, errorNotification} from './helpers/notifications'
import moment from 'moment'

export const loadSettings = createAction('dftba/ledger/LOAD_SETTINGS', payload => {
  return ({client, dispatch})=> {
    return client.get('settings')
      .then(reduceSettings)
      .then(calcCycleTime)
  }
})

export const saveSettings = createAction('dftba/ledger/SAVE_SETTINGS', payload => {
  return ({client, dispatch})=> {
    return client.post('settings/save', {
      body: payload
    }).then(reduceSettings)
      .then(calcCycleTime)
      .then(successNotification('Settings', 'saved'))
      .catch(errorNotification('Settings', 'saved'))
  }
})

function reduceSettings(settingRecords) {
  if (!Array.isArray(settingRecords)) return {}
  return settingRecords.reduce((m, setting) => {
    m[setting.key] = setting.value
    return m
  }, {})
}

function calcCycleTime(settings) {
  let cycleTime = moment()

  cycleTime.seconds(0)
    .milliseconds(0)
    .utcOffset(settings.offset || '-07:00')

  if (settings.day) {
    cycleTime.date(parseInt(settings.day, 10))
  }

  if (settings.hours) {
    cycleTime.hours(parseInt(settings.hours, 10))
  }

  if (settings.minutes) {
    cycleTime.minutes(parseInt(settings.minutes, 10))
  }

  if (settings.seconds) {
    cycleTime.seconds(parseInt(settings.seconds, 10))
  } else {
    cycleTime.seconds(59)
  }


  settings.cycleTime = cycleTime.toString()

  return settings
}

const initialState = {}

export default handleActions({
  [loadSettings]: (state, {payload})=> ({ ...payload }),
  [saveSettings]: (state, {payload})=> ({ ...payload })
}, initialState)