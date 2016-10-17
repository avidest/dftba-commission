import {Builder}            from 'sequelize-classes';
import Commission           from '../models/commission';
import Order                from '../models/order';
import OrderLineItem        from '../models/order-line-item';
import Product              from '../models/product';
import ProductImage         from '../models/product-image';
import ProductVariant       from '../models/product-variant';
import Transaction          from '../models/transaction';
import UserProfile          from '../models/user-profile';
import Setting              from '../models/setting';

const databaseLogging = process.env.DATABASE_LOGGING || false

const options = {
  databaseUrl: process.env.DATABASE_URL,
  config: {
    logging: databaseLogging ? console.log : false,
    dialect: 'postgres',
    define: {
      underscored: true
    },
    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
}

const database = new Builder(options, [
  Commission,
  Order,
  OrderLineItem,
  Product,
  ProductImage,
  ProductVariant,
  Transaction,
  UserProfile,
  Setting
])

export default database

export async function sync(force = false) {
  try {
    await database.sequelize.sync({ force })
    console.log(`Database synced... ${force ? 'with force!' : ''}`)
    let {Product, UserProfile, Order, Transaction} = database

    /**
     * User Profiles
     */
    let userCount = await UserProfile.count()
    if (userCount === 0) {
      console.log('No user profiles found, attempting to download...')
      let results = await UserProfile.downloadAll()
      if (results) {
        console.log(`${results.length} users created!`)
      }
    }

    /**
     * Products
     */
    let productCount = await Product.count()
    if (productCount === 0) {
      console.log('No products found, attempting to download...')
      let results = await Product.downloadAll()
      if (results) {
        console.log(results)
      }
    }

    /**
     * Orders
     */
    let orderCount = await Order.count()
    if (orderCount === 0) {
      console.log('No orders found, attempting to download...')
      let results = await Order.downloadAll()
      if (results) {
        console.log(results)
      }
    }

    let transactionCount = await Transaction.count()
    if (transactionCount === 0) {
      console.log('No transactions found, attempting to compute...')
      let results = await Order.computeAllTransactions()
      if (results) {
        console.log(results)
        console.log('Making up some fake transactions...')
        var sample = require('lodash/sample')
        var moment = require('moment')
        require('moment-range')
        let creators = await UserProfile.findAllCreators()
        let trans = []
        let range = moment.range('1/5/16', moment())

        range.by('day', moment => {
          for (let i = 0; i < 50; i++) {
            let creator = sample(creators)
            let neg = Math.random() > 0.7
            let dollars = getRandomInt(0, 100)
            let cents = getRandomInt(0, 100)
            let amount = dollars + (cents / 100)
            let hour = getRandomInt(0, 24)
            let minute = getRandomInt(0, 60)
            let second = getRandomInt(0, 60)
            if (neg) {
              amount = amount * -1
            }
            let time = moment.hours(hour).minutes(minute).seconds(second).toJSON()
            trans.push({
              amount,
              kind: neg ? 'debit' : 'credit',
              user_id: creator.user_id,
              description: 'TEST DATA PLZ',
              created_at: time,
              updated_at: time,
              effective_at: time
            })
          }
        })

        await Transaction.bulkCreate(trans)
        console.log('Done.')

      }
    }

  } catch(e) {
    console.error(e)
  }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}