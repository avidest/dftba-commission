import find from 'lodash/find'
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
@hasMany('Transaction', { foreignKey: 'user_id', as: 'transactions' })
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

  static findAllCreators(opts) {
    return this.findAll({
      attributes: [
        'user_id',
        'user_metadata',
        'app_metadata',
        'picture'
      ],
      where: {
        'app_metadata.role': 'creator'
      }
    })
  }

  static findCreatorGrossCredits(opts, user_id) {
    let {fn, col} = this.sequelize
    let {Transaction} = this.sequelize.models
    let query = {
      attributes: [
        [fn('sum', col('Transaction.amount')), 'grossCredits'],
        [col('Transaction.user_id'), 'user_id']
      ],
      where: {
        kind: 'credit'
      },
      group: [col('Transaction.user_id')]
    }
    if (user_id) {
      query.where.user_id = user_id
    }
    return Transaction.findAll(query)
  }

  static findCreatorGrossDebits(opts, user_id) {
    let {fn, col} = this.sequelize
    let {Transaction} = this.sequelize.models
    let query = {
      attributes: [
        [fn('sum', col('Transaction.amount')), 'grossDebits'],
        [col('Transaction.user_id'), 'user_id']
      ],
      where: {
        kind: 'debit'
      },
      group: [col('Transaction.user_id')]
    }
    if (user_id) {
      query.where.user_id = user_id
    }
    return Transaction.findAll(query)
  }

  static findCreatorStartingBalances(opts, user_id) {
    let {fn, col} = this.sequelize
    let {Transaction} = this.sequelize.models
    let query = {
      attributes: [
        [fn('sum', col('Transaction.amount')), 'startingBalance'],
        [col('Transaction.user_id'), 'user_id']
      ],
      group: [col('Transaction.user_id')]
    }
    if (user_id) {
      query.where.user_id = user_id
    }
    return Transaction.findAll(query)
  }

  static async findCreatorTransactionSummaries(opts) {
    let [
      creatorRecords,
      startingBalances,
      grossCredits,
      grossDebits,
    ] = await Promise.all([
      this.findAllCreators(opts),
      this.findCreatorStartingBalances(opts),
      this.findCreatorGrossCredits(opts),
      this.findCreatorGrossDebits(opts)
    ])

    let creators = creatorRecords.map(c => c.toJSON())
    grossCredits = grossCredits.map(c => c.toJSON())
    grossDebits = grossDebits.map(c => c.toJSON())

    return startingBalances.map(s => {
      let summary = s.toJSON()
      let credits = find(grossCredits, {user_id: s.user_id}).grossCredits
      let debits = find(grossDebits, {user_id: s.user_id}).grossDebits
      console.log(typeof credits, typeof debits)
      summary.startingBalance = (summary.startingBalance / 100).toFixed(2)
      summary.grossCredits = (credits / 100).toFixed(2)
      summary.grossDebits = (debits / 100).toFixed(2)
      summary.netBalance = ((parseInt(debits, 10) + parseInt(credits, 10)) / 100).toFixed(2)
      summary.user = find(creators, {user_id: s.user_id})
      delete summary.amount
      return summary
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