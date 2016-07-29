import {
  DECIMAL,
  FLOAT
} from 'sequelize'

import {
  Model,
  hasOne,
  belongsTo
} from 'sequelize-classes'

@belongsTo('UserProfile', { foreignKey: 'user_id' })
@belongsTo('Product', { foreignKey: 'product_id' })
export default class Commission extends Model {

  percent = { type: FLOAT }

  flat = { type: DECIMAL }

}