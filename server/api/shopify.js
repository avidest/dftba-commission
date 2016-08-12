import {Router, route} from 'laforge'
import database from '../services/database'

const {Product, Order} = database.sequelize.models

export default class ShopifyRouter extends Router {

  @route('POST', '/products/create')
  createProduct(opts, http) {
    Product.createFromShopify(opts.body)
      .then(webhookSuccess('Product', 'product/create'))
      .catch(webhookError('Product', 'product/create'))
    return {success: true}
  }

  @route('POST', '/products/update')
  updateProduct(opts, http) {
    Product.updateFromShopify(opts.body)
      .then(webhookSuccess('Product', 'product/update'))
      .catch(webhookError('Product', 'product/update'))
    return {success: true}
  }

  @route('POST', '/products/delete')
  deleteProduct(opts, http) {
    Product.destroyFromShopify(opts.body)
      .then(webhookSuccess('Product', 'product/delete'))
      .catch(webhookError('Product', 'product/delete'))
    return {success: true}
  }

  @route('POST', '/orders/create')
  createOrder(opts, http) {
    Order.createFromShopify(opts.body)
      .then(webhookSuccess('Order', 'orders/create'))
      .catch(webhookError('Order', 'orders/create'))
    return {success: true}
  }

  @route('POST', '/orders/cancelled')
  cancelOrder(opts, http) {
    Order.updateFromShopify(opts.body)
      .then(webhookSuccess('Order', 'orders/cancelled'))
      .catch(webhookError('Order', 'orders/cancelled'))
    return {success: true}
  }

  @route('POST', '/orders/delete')
  deleteOrder(opts, http) {
    Order.destroyFromShopify(opts.body)
      .then(webhookSuccess('Order', 'orders/delete'))
      .catch(webhookError('Order', 'orders/delete'))
    return {success: true}
  }

  @route('POST', '/orders/updated')
  updateOrder(opts, http) {
    Order.updateFromShopify(opts.body)
      .then(webhookSuccess('Order', 'orders/updated'))
      .catch(webhookError('Order', 'orders/updated'))
    return {success: true}
  }

  @route('POST', '/refunds/create')
  createRefund(opts, http) {
    Order.updateFromShopify(opts.body)
      .then(webhookSuccess('Order', 'refunds/create'))
      .catch(webhookError('Order', 'refunds/create'))
    return {success: true}
  }
}

function webhookSuccess(modelName, topic) {
  return (x)=> {
    console.log(`${modelName}: ${topic} processed successfully.`)
    return x
  }
}

function webhookError(modelName, topic) {
  return (err) => {
    console.log(`${modelName} Error: ${topic}`)
    console.log(err)
  }
} 



