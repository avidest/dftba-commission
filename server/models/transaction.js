import {
  INTEGER,
  TEXT,
  ENUM,
  DATE,
  NOW,
  BOOLEAN
} from 'sequelize'

import {
  Model,
  hasOne,
  belongsTo
} from 'sequelize-classes'

@belongsTo('UserProfile',   { as: 'user', foreignKey: 'user_id' })
@belongsTo('Order',         { as: 'order', foreignKey: 'order_id' })
@belongsTo('OrderLineItem', { as: 'line_item', foreignKey: 'line_item_id' })
export default class Transaction extends Model {

  description = { type: TEXT };

  kind = { 
    type: ENUM('debit', 'credit'), 
    allowNull: false 
  };

  payout = {
    type: BOOLEAN,
    defaultValue: false
  };

  amount = { 
    type: INTEGER,
    allowNull: false,
    get() {
      if (!this.getDataValue('amount')) {
        return 0;
      }
      return (this.getDataValue('amount') / 100).toFixed(2)
    },
    set(value) {
      if (typeof value === 'string') {
        return this.setDataValue('amount', parseFloat(value) * 100)
      } else if (typeof value === 'number') {
        return this.setDataValue('amount', value * 100)
      } else {
        throw new Error('Bad type')
      }
    },
    validate: {
      isDecimal: true,
      isValid(value) {
        let val = parseFloat(value)
        if (this.kind === 'debit') {
          if (val > 0) {
            throw new Error(`Transaction is a debit, amount must be >= 0`)
          }
        } else if (this.kind === 'credit') {
          if (val < 0) {
            throw new Error('Transaction is a credit, amount must be >= 0')
          }
        }
      }
    }
  };

  static calcCommissionAmount(order, line, commission, negative = false) {
    let {percent, flat} = commission
    let totalDiscounts = parseFloat(order.total_discounts)
    let totalLineItemsPrice = parseFloat(order.total_line_items_price)

    // Percentage to multiply all prices by
    let discountRatio = (totalDiscounts > 0) 
      ? 1 - (totalDiscounts / totalLineItemsPrice)
      : 1

    let percentFlat = (parseFloat(line.price) * discountRatio) * (parseFloat(percent) / 100)
    flat = (parseFloat(flat) * 100) || 0
    percentFlat = percentFlat * 100

    // Amount = (line.price * discountPercent * commissionPercent) + commissionFlat
    let amount = (((flat + percentFlat) * line.quantity) / 100).toFixed(2)

    return negative ? ('-' + amount) : amount
  }

  static async createRefundFromOrder(order, refund) {
    let {OrderLineItem} = this.sequelize.models
    let transactions = []
    for (let refundLine of refund.refund_line_items) {
      let line = await OrderLineItem.findById(refundLine.line_item_id)
      if (!line) continue;
      let [product, variant] = await Promise.all([line.getProduct(), line.getVariant()])
      let commissions = await product.getCommissions({ include: [{all: true} ]})

      for (let commish of commissions) {
        transactions.push({
          line_item_id: refundLine.line_item_id,
          order_id: order.id,
          user_id: commish.user_id,
          description: `Chargeback for ${line.quantity}× ${product.title} ${variant.title === 'Default Title' ? '' : ('/ ' + variant.title)}`,
          kind: 'debit',
          amount: this.calcCommissionAmount(order, line, commish, true),
          created_at: refund.created_at
        })
      }
    }

    return await this.bulkCreate(transactions)
  }

  static async createFromOrder(order, line) {
    let [product, variant] = await Promise.all([line.getProduct(), line.getVariant()])
    let commissions = await product.getCommissions({ include: [{all: true} ]})

    let transactions = []

    for (let commish of commissions) {
      transactions.push({
        line_item_id: line.id,
        order_id: order.id,
        user_id: commish.user_id,
        description: `${line.quantity}× ${product.title} ${variant.title === 'Default Title' ? '' : ('/ ' + variant.title)}`,
        kind: 'credit',
        amount: this.calcCommissionAmount(order, line, commish),
        created_at: order.created_at
      })
    }

    return await this.bulkCreate(transactions)
  }

  static async updateFromOrder(order, line) {
    console.log(order.toJSON())
    console.log(line.toJSON())
  }

}