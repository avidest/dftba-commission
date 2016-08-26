import {createAction, handleActions} from 'protium'
import {successNotification, errorNotification} from './helpers/notifications'

export const loadSettings = createAction('dftba/ledger/LOAD_SETTINGS', payload => {
  return ({client, dispatch})=> {
    return client.get('settings')
      .then(reduceSettings)
  }
})

export const saveSettings = createAction('dftba/ledger/SAVE_SETTINGS', payload => {
  return ({client, dispatch})=> {
    return client.post('settings/save', {
      body: payload
    }).then(reduceSettings)
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

const initialState = {}

export default handleActions({
  [loadSettings]: (state, {payload})=> ({ ...payload }),
  [saveSettings]: (state, {payload})=> ({ ...payload })
}, initialState)