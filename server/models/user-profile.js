import map from 'lodash/map'
import find from 'lodash/find'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'

import {getCurrentCycle} from '../../lib/cycle'

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

  static findAllCreators(opts, user_id) {
    let query = {
      attributes: [
        'user_id',
        'user_metadata',
        'app_metadata',
        'picture'
      ],
      where: {
        'app_metadata.role': 'creator'
      }
    }
    if (user_id) {
      query.where.user_id = user_id
    }

    return this.findAll(query)
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

    if (!opts.startDate) {
      opts.startDate = (new Date()).toISOString()
    }


    if (!opts.endDate) {
      opts.endDate = (new Date()).toISOString()
    }

    query.where.created_at = {
      $between: [opts.startDate, opts.endDate]
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


    if (!opts.startDate) {
      opts.startDate = (new Date()).toISOString()
    }


    if (!opts.endDate) {
      opts.endDate = (new Date()).toISOString()
    }

    query.where.created_at = {
      $between: [opts.startDate, opts.endDate]
    }

    return Transaction.findAll(query)
  }

  static findTransactionsByCreator(opts = {}, user_id) {
    let {Transaction} = this.sequelize.models
    let query = { where: {} }

    if (opts.kind) {
      query.where.kind = opts.kind
    }

    if (user_id) {
      query.where.user_id = user_id
    }

    if (!opts.startDate) {
      opts.startDate = (new Date()).toISOString()
    }

    if (!opts.endDate) {
      opts.endDate = (new Date()).toISOString()
    }

    query.where.created_at = {
      $between: [opts.startDate, opts.endDate]
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
      where: {},
      group: [col('Transaction.user_id')]
    }

    if (user_id) {
      query.where.user_id = user_id
    }

    if (opts.startDate) {
      query.where.created_at = {
        $lt: new Date(opts.startDate)
      }
    }

    return Transaction.findAll(query)
  }

  static getCommissionRatesWithVariantsForUser(user_id) {
    let {Product, ProductVariant, Commission} = this.sequelize.models
    return Commission.findAll({
      attributes: [
        'user_id',
        'product_id'
      ],
      where: {
        user_id
      },
      include: [
        {
          attributes: ['id', 'title'],
          model: Product,
          as: 'product',
          include: [
            { model: ProductVariant, as: 'variants', attributes: [
              'id',
              'product_id',
              'title'
            ]}
          ]
        }
      ]
    })
  }

  static async findCreatorSalesSummaries(opts, user_id) {
    let {fn, col} = this.sequelize
    let {OrderLineItem} = this.sequelize.models
    let commissionRates = await this.getCommissionRatesWithVariantsForUser(user_id)
    let variants = invertCommissionsIntoVariants(commissionRates)
    let variantIds = uniq(map(variants, 'id'))

    let totalQuery = {
      raw: true,
      group: [col('OrderLineItem.variant_id')],
      sort: [col('OrderLineItem.variant_id')],
      attributes: [
        [fn('sum', col('OrderLineItem.quantity')), 'quantity'],
        [col('OrderLineItem.variant_id'), 'variant_id']
      ],
      where: {
        variant_id: {
          $in: variantIds
        }
      }
    }

    let periodQuery = {
      raw: true,
      group: totalQuery.group,
      attributes: totalQuery.attributes,
      sort: totalQuery.sort,
      where: {
        variant_id: {
          $in: variantIds
        },
        created_at: {
          $lte: opts.endDate,
          $gt: opts.startDate
        }
      },
    }

    let [qtyTotals, periodTotals] = await Promise.all([
      OrderLineItem.findAll(totalQuery),
      OrderLineItem.findAll(periodQuery)
    ])

    return {
      total: sortBy(qtyTotals.map(extractTitle(variants)), 'variant_id'),
      period: sortBy(periodTotals.map(extractTitle(variants)), 'variant_id')
    }
  }

  static async findCreatorTransactionSummaries(opts, user_id) {
    let [
      creatorRecords,
      startingBalances,
      grossCredits,
      grossDebits,
    ] = await Promise.all([
      this.findAllCreators({}, user_id),
      this.findCreatorStartingBalances(opts, user_id),
      this.findCreatorGrossCredits(opts, user_id),
      this.findCreatorGrossDebits(opts, user_id)
    ])

    let creators = creatorRecords.map(c => c.toJSON())
    startingBalances = startingBalances.map(s => s.toJSON())
    grossCredits = grossCredits.map(c => c.toJSON())
    grossDebits = grossDebits.map(c => c.toJSON())

    let summaries = creators.map(creator => {
      
      let cStartingBalance = find(startingBalances, {user_id: creator.user_id})
      let startingBalance = cStartingBalance ? cStartingBalance.startingBalance : 0

      let cGrossCredits = find(grossCredits, {user_id: creator.user_id})
      let credits = cGrossCredits ? cGrossCredits.grossCredits : 0
      
      let cGrossDebit = find(grossDebits, {user_id: creator.user_id})
      let debits = cGrossDebit ? cGrossDebit.grossDebits : 0
      
      let summary = { user_id: creator.user_id, user: creator };

      summary.startingBalance = (startingBalance / 100).toFixed(2)
      summary.grossCredits = (credits / 100).toFixed(2)
      summary.grossDebits = (debits / 100).toFixed(2)
      summary.cycleEnd = opts.endDate
      summary.cycleStart = opts.startDate
      summary.netBalance = (
        (parseInt(startingBalance, 10)
          + parseInt(debits, 10)
          + parseInt(credits, 10)
      ) / 100).toFixed(2)
      return summary
    })

    if (summaries.length === 1) {
      return summaries[0]
    }

    return summaries
  }

  static async findProductsByUser(id) {
    let {Commission, Product, ProductVariant, ProductImage} = this.sequelize.models
    let commishs = await Commission.findAll({
      attributes: [
        'id',
        'user_id',
        'product_id'
      ],
      where: {
        user_id: id
      }
    })

    let productIds = map(commishs, 'product_id')
    return await Product.findAll({
      where: {
        id: {
          $in: productIds
        }
      },
      include: [
        { model: ProductVariant, as: 'variants' },
        { model: ProductImage, as: 'images' },
        { model: Commission, as: 'commissions', where: {
          id: { $in: map(commishs, 'id') }
        }}
      ]
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


const invertCommissionsIntoVariants = rates => rates.reduce((m, commish)=> {
    if (commish.product) {
      if (commish.product.variants.length) {
        commish.product.variants.forEach(variant => {
          variant.product = commish.product
          m.push(variant)
        })
      }
    }
    return m
  }, [])

const extractTitle = variants => grp => {
  let variant = find(variants, {id: grp.variant_id})
  grp.title = `${variant.product.title} ${variant.title === 'Default Title' ? '' : `/ ${variant.title}`}`
  return grp
}
