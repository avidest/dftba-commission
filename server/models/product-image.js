import {
  Model,
  belongsTo
} from 'sequelize-classes'

import {
  STRING,
  INTEGER,
  BIGINT,
} from 'sequelize'

@belongsTo('Product', { as: 'product', foreignKey: 'product_id' })
export default class ProductImage extends Model {

  id = { type: BIGINT, allowNull: false, unique: true, primaryKey: true };

  src = { type: STRING, allowNull: false };

  position = { type: INTEGER, allowNull: false };

}