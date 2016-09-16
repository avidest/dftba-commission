import {route} from 'laforge'
import {CollectionRouter} from 'laforge-sequelize'
import find from 'lodash/find'

export default class UserProfileRouter extends CollectionRouter {
  @route('GET', '/creators', 50)
  getCreators(opts, http) {
    return this.model.findAllCreators(opts.query)
      .catch(catchError)
  }

  @route('GET', '/creators/transactions/summaries')
  getCreatorsTransactionSummary(opts, http) {
    return this.model.findCreatorTransactionSummaries(opts.query)
      .catch(catchError)
  }

  @route('GET', '/:user_id/transactions/summary')
  getCreatorsTransactionSummaryByUser(opts, http) {
    return this.model.findCreatorTransactionSummaries(opts.query, opts.params.user_id)
      .catch(catchError)
  }
  @route('GET', '/:user_id/transactions/sales-summary')
  getCreatorsSalesSummaryByUser(opts, http) {
    return this.model.findCreatorSalesSummaries(opts.query, opts.params.user_id)
      .catch(catchError)
  }

  @route('GET', '/:user_id/transactions')
  getCreatorsTransactions(opts, http) {
    return this.model.findTransactionsByCreator(opts.query, opts.params.user_id)
      .catch(catchError)
  }

  @route('GET', '/:user_id/products')
  getProductsByUser(opts, http) {
    return this.model.findProductsByUser(opts.params.user_id)
      .catch(catchError)
  }

}


const catchError = err => {
  console.log(err)
  return []
}