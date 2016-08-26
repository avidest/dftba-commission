import {route} from 'laforge'
import {CollectionRouter} from 'laforge-sequelize'
import find from 'lodash/find'

export default class UserProfileRouter extends CollectionRouter {
  @route('GET', '/creators', 50)
  getCreators(opts, http) {
    return this.model.findAllCreators(opts.query)
  }

  @route('GET', '/creators/transactions/summaries')
  getCreatorsTransactionSummary(opts, http) {
    return this.model.findCreatorTransactionSummaries(opts.query)
  }
}
