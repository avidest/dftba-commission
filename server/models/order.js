import Shopify from '../services/shopify'
import {Model, hasMany} from 'sequelize-classes'
import {
  STRING,
  INTEGER,
  BIGINT,
  ENUM,
  DATE,
  JSONB,
  ARRAY,
  BOOLEAN,
  DECIMAL
} from 'sequelize'
import find from 'lodash/find'

@hasMany('OrderLineItem', {as: 'line_items', foreignKey: 'order_id'})
@hasMany('Transaction',   {as: 'transactions', foreignKey: 'order_id'})
export default class Order extends Model {

  id = { type: BIGINT, allowNull: false, unique: true, primaryKey: true };

  cancel_reason = { type: ENUM('customer', 'fraud', 'inventory', 'other') };

  cart_token = { type: STRING };

  cancelled_at = { type: DATE };

  closed_at = { type: DATE };

  currency = { type: STRING };
  
  email = { type: STRING };

  financial_status = { type: ENUM(
      'pending', 
      'authorized', 
      'partially_paid', 
      'paid', 
      'partially_refunded', 
      'refunded', 
      'voided'
    )
  };

  fulfillment_status = { type: ENUM('fulfilled', 'partial', 'null') };

  tags = {
    type: ARRAY(STRING),
    set(val) {
      let arr
      if (typeof val === 'string') {
        arr = val.split(',').map(x => x.trim()).sort()
      } else if (Array.isArray(val)) {
        arr = val.map(x => x.trim()).sort()
      } else {
        arr = val
      }
      this.setDataValue('tags', arr)
    }
  };

  name = { type: STRING };

  note_attributes = { type: JSONB };

  number = { type: INTEGER };

  order_number = { type: INTEGER };

  processed_at = { type: DATE };

  processing_method = { type: ENUM('checkout', 'direct', 'manual', 'offsite', 'express') };

  refunds = { type: JSONB };

  source_name = { type: ENUM('web', 'pos', 'iphone', 'android', 'api') };

  subtotal_price = { type: DECIMAL };

  tax_lines = { type: JSONB };

  taxes_included = { type: BOOLEAN };

  token = { type: STRING };

  total_discounts = { type: DECIMAL };

  total_line_items_price = { type: DECIMAL };

  total_price = { type: DECIMAL };

  total_tax = { type: DECIMAL };

  total_weight = { type: INTEGER };

  async processTransactions() {
    let {Transaction} = this.sequelize.models
    await this.reload({ include: [{all: true}] })
    let transactions = []

    for (let line of this.line_items) {
      transactions.push(Transaction.createFromOrder(this, line))
    }

    return Promise.all(transactions)
  }

  async updateRefundsFromShopify(sRefunds) {
    let {Transaction} = this.sequelize.models
    let currentRefunds = this.get('refunds')
    let transactions = []
    let refunds = []
    for (let refund of sRefunds) {
      let existing = find(currentRefunds, {id: refund.id})
      if (!existing || !existing.processed) {
        transactions.push(Transaction.createRefundFromOrder(this, refund))
        refund.processed = true;
      } else {
        refunds.push(existing)
      }
      refunds.push(refund)
    }
    await Promise.all(transactions)
    return refunds
  }

  async updateLineItemsFromShopify(sLineItems) {
    let line_items = this.line_items
    let updates = []
    if (!line_items) {
      line_items = await this.getLineItems()
    }

    for (let sLine of sLineItems) {
      let line = find(line_items, {id: sLine.id.toString()})
      // If line exists, update it.
      if (line) {
        line.set(sLine)
        updates.push(line.save())
      } 
      // If line doesn't exist, create it
      else {
        updates.push(this.createLineItem(sLine))
      }
    }

    for (let line of line_items) {
      // If line exists locally but has been deleted in Shopify
      if (!find(sLineItems, {id: parseInt(line.id, 10)})) {
        updates.push(line.destroy())
      }
    }

    return await Promise.all(updates)
  }

  static async createFromShopify(data) {
    return await this.create(data, { 
      include: [{all: true}] 
    }).then(order => {
      return order.processTransactions()
        .then(transactions => order)
    })
  }

  static async updateFromShopify(data) {
    let {
      id,
      line_items,
      refunds,
      ...update
    } = data

    let order = await this.findById(id, {
      include: [{all: true}]
    })

    if (order) {
      order.set(update)
      let refundUpdates = await order.updateRefundsFromShopify(refunds)
      order.set('refunds', refundUpdates)
      let lineItemUpdates = await order.updateLineItemsFromShopify(line_items)
      return await order.save()
    }
    return order
  }

  static async destroyFromShopify(data) {
    let order = await this.findById(data.id)
    if (order) {
      return await order.destroy({ onDelete: 'CASCADE' })
    }
    return order
  }

  static async downloadAll() {
    let {OrderLineItem} = this.sequelize.models
    let sOrders = await Shopify.Orders.findAll({complete: true})
    let lines = []
    let orders = sOrders.map(o => {
      let order = o.toObject()
      order.line_items.forEach(line => {
        lines.push({ ...line, order_id: order.id })
      })
      return order
    })

    return {
      orders: (await this.bulkCreate(orders)).length,
      lines: (await OrderLineItem.bulkCreate(lines)).length
    }
  }

  static async processOrdersInRange(opts) {
    let sOrders = (await Shopify.Orders.findAll({
      created_at_min: opts.from,
      created_at_max: opts.to,
      complete: true
    })).map(o => o.toObject())

    let messages = []

    let msg1 = `Processing historical ${sOrders.length} orders...`
    // messages.push(msg1)
    console.log(msg1)

    let created = 0
    let updated = 0

    for (let sOrder of sOrders) {
      let order = await this.findById(sOrder.id)
      if (!order) {
        this.createFromShopify(sOrder).catch(err => console.log(err))
        created++
      } else {
        this.updateFromShopify(sOrder).catch(err => console.log(err))
        updated++
      }
    }

    let msg2 = `Done. Created: ${created}, Updated: ${updated}`
    messages.push(msg2)
    console.log(msg2)

    return {created, updated, message: messages.join('\n')}
  }

  static async computeAllTransactions() {
    let orders = await this.findAll()
    let processed = await Promise.all(orders.map(o => o.processTransactions()))
    let transactions = processed.reduce((m, orders)=> {
      if (orders && orders.length) {
        return m = m.concat(orders.reduce((k, transactions)=> {
          return k = k.concat(transactions)
        }, [])) 
      }
      return m
    }, [])
    return {
      transactions: transactions.length
    }
  }

}