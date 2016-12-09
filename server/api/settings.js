import {route} from 'laforge'
import {CollectionRouter} from 'laforge-sequelize'
import find from 'lodash/find'

export default class SettingRouter extends CollectionRouter {

  @route('POST', '/save')
  async saveSettings(opts, http) {
    let settings = opts.body
    let promises = []
    let current = await this.model.findAll()
    Object.keys(settings).forEach(key => {
      let setting = find(current, {key})
      if (setting) {
        if (settings[key] === 'null') {
          settings[key] = null
        }
        setting.set('value', settings[key])
        promises.push(setting.save())
      } else {
        promises.push(this.model.create({key, value: settings[key]}))
      }
    })
    return Promise.all(promises).then(x => {
      return this.model.findAll()
    })
  }

  @route('POST', '/fetch-historical-data')
  async fetchHistoricalData(opts, http) {
    let Orders = this.getModel('Order')
    return Orders.processOrdersInRange(opts.data)
      .catch(err => {
        console.log(err)
        http.res.status(500)
        return {error: true}
      })
  }

}
