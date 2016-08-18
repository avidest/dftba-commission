import {
  DECIMAL,
  TEXT,
  ENUM
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

  kind = { type: ENUM('debit', 'credit'), allowNull: false };

  amount = { 
    type: DECIMAL,
    allowNull: false,
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

  static calculateAmount(commission, variant) {
    let {percent, flat} = commission
    let price = (parseFloat(variant.price) * 100) || 0
    flat = (parseFloat(flat) * 100) || 0
    let percentFlat = parseFloat(variant.price) * (parseFloat(percent) / 100)
    percentFlat = percentFlat * 100
    let amount = ((flat + percentFlat) / 100).toFixed(2)
    console.log(amount)
    return amount
  }

  static async createFromOrder(order, line) {
    let [variant, product] = await Promise.all([line.getVariant(), line.getProduct()])
    let commissions = await product.getCommissions({ include: [{all: true} ]})
    console.log('product found', !!product, commissions.map(c => c.toJSON()))

    let toCreate = []

    for (let commish of commissions) {
      toCreate.push({
        line_item_id: line.id,
        order_id: order.id,
        user_id: commish.user_id,
        description: `Commission earned for order #${order.id}, line-item #${line.id}`,
        kind: 'credit',
        amount: this.calculateAmount(commish, variant)
      })
    }

    return this.bulkCreate(toCreate)
  }

}