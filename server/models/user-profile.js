import {
  BOOLEAN,
  INTEGER,
  STRING,
  JSONB,
  VIRTUAL
} from 'sequelize'

import {
  Model,
  belongsTo,
  hasMany,
  hook
} from 'sequelize-classes'

import {
  getAllUsers,
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser
} from '../services/auth-client'

@hasMany('Commission', { foreignKey: 'user_id', as: 'commissions' })
export default class UserProfile extends Model {

  user_id = { type: STRING, allowNull: false, unique: true, primaryKey: true };

  email = {type: STRING, allowNull: false, unique: true}

  email_verified = {type: BOOLEAN, allowNull: false}

  picture = {type: STRING}

  name = {
    type: VIRTUAL,
    get() {
      let meta = this.getDataValue('user_metadata')
      return meta.name ? meta.name : null
    }
  }

  role = {
    type: VIRTUAL,
    get() {
      let meta = this.getDataValue('app_metadata')
      return meta.role ? meta.role : null
    }
  }

  app_metadata = {type: JSONB}

  user_metadata = {type: JSONB}

  static findAllCreators() {
    return this.findAll({
      attributes: ['user_id', 'user_metadata', 'app_metadata'],
      where: {
        'app_metadata.role': 'creator'
      }
    })
  }

  static downloadAll() {
    return getAllUsers().then(users => {
      return this.bulkCreate(users)
    })
  }

  @hook('afterUpdate')
  static updateAuth0(instance, opts) {
    if (!opts.request) {
      return instance
    }

    let {
      passwordConfirm,
      ...payload
    } = opts.request.data

    return updateUser(instance.user_id, payload)
      .then(update => {
        instance.set({ ...update })
        return instance.save()
      })
  }

  @hook('beforeValidate')
  static createAuth0(instance, opts) {
    if (instance.user_id) {
      return instance
    }

    let {
      passwordConfirm,
      ...payload
    } = opts.request.data

    return createUser(payload)
      .then(created => {
        instance.set(created)
        return instance
      })
  }

  @hook('afterDestroy')
  static deleteAuth0(instance, opts) {
    let payload = instance.toJSON()
    return deleteUser(payload.user_id)
      .then(deleted => instance)
  }

}