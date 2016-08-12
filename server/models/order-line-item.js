import Shopify from '../services/shopify'
import {
  Model, 
  belongsTo, 
  hasOne
} from 'sequelize-classes'
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

@belongsTo('Order', { as: 'order', foreignKey: 'order_id' })
@belongsTo('Product', { as: 'product', foreignKey: 'product_id' })
@belongsTo('ProductVariant', { as: 'variant', foreignKey: 'variant_id' })
@hasOne('Transaction', { as: 'transaction', foreignKey: 'line_item_id' })
export default class OrderLineItem extends Model {

  id = { type: BIGINT, allowNull: false, unique: true, primaryKey: true };

  grams = { type: INTEGER };

  price = { type: DECIMAL };

  quantity = { type: INTEGER };

  sku = { type: STRING };

  title = { type: STRING };

  variant_title = { type: STRING };

  vendor = { type: STRING };

  name = { type: STRING };

  gift_card = { type: BOOLEAN };

  properties = { type: JSONB };

  taxable = { type: BOOLEAN };

  tax_lines = { type: JSONB };

  total_discount = { type: DECIMAL };

}