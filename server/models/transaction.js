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

}