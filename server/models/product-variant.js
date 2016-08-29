import {
  Model, 
  belongsTo, 
  belongsToMany, 
  hook
} from 'sequelize-classes'

import {
  STRING,
  ARRAY,
  INTEGER,
  BIGINT,
  TEXT,
  JSONB,
  BOOLEAN,
  DECIMAL
} from 'sequelize'

@belongsTo('Product', { as: 'product', foreignKey: 'product_id' })
export default class ProductVariant extends Model {

  id = { type: BIGINT, allowNull: false, unique: true, primaryKey: true };

  inventory_quantity = { type: INTEGER }

  barcode = { type: STRING };

  option1 = { type: STRING };

  option2 = { type: STRING };

  option3 = { type: STRING };

  position = { type: INTEGER };

  price = { type: DECIMAL, allowNull: false };

  sku = { type: STRING };

  title = { type: STRING, allowNull: false };

}