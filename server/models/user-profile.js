import {
  BOOLEAN,
  INTEGER,
  STRING,
  JSONB
} from 'sequelize'

import {
  Model,
  belongsTo,
  hasMany
} from 'sequelize-classes'

@hasMany('Commission', { foreignKey: 'user_id', as: 'commissions' })
export default class UserProfile extends Model {

  user_id = { type: STRING, allowNull: false, unique: true, primaryKey: true };

  email = {type: STRING, allowNull: false, unique: true}

  email_verified = {type: BOOLEAN, allowNull: false}

  picture = {type: STRING}

  name = {type: STRING}

  role = {type: STRING}

  app_metadata = {type: JSONB}

  user_metadata = {type: JSONB}

  static downloadAll() {
    return
  }

}