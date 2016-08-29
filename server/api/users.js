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

  @route('GET', '/:user_id/transactions/summary')
  getCreatorsTransactionSummaryByUser(opts, http) {
    return this.model.findCreatorTransactionSummaries(opts.query, opts.params.user_id)
  }

  @route('GET', '/:user_id/transactions')
  getCreatorsTransactions(opts, http) {
    return this.model.findTransactionsByCreator(opts.query, opts.params.user_id)
  }

  @route('GET', '/:user_id/products')
  getProductsByUser(opts, http) {
    return this.model.findProductsByUser(opts.params.user_id)
  }

}
