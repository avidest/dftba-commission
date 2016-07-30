import {route} from 'laforge'
import {CollectionRouter} from 'laforge-sequelize'

export default class UserProfileRouter extends CollectionRouter {
  @route('GET', '/creators', 50)
  getCreators(opts, http) {
    return this.model.findAllCreators()
  }
}
