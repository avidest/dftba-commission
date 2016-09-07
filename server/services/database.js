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

const databaseLogging = process.env.DATABASE_LOGGING || 1

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
      }
    }


    // if (__DEVELOPMENT__) {
    //   var tranns = []
    //   for (let k = 0; k < 100; k++) {
    //     console.time('time-' + k)
    //     for (let i = 0; i < 1000; i++) {
    //       let kind = Math.random() > 0.5 ? 'credit' : 'debit'
    //       tranns.push({
    //         description: 'test ' + i,
    //         amount: (Math.random() * 100) * (kind === 'credit' ? 1 : -1),
    //         kind,
    //         user_id: 'auth0|57b4a7d43c7cb335712a36b8'
    //       })
    //     }
    //     console.log('starting bulkCreate', k)
    //     await Transaction.bulkCreate(tranns)
    //     console.log('finished bulkCreate', k)
    //     console.timeEnd('time-' + k)
    //   }
    // }

  } catch(e) {
    console.error(e)
  }
}