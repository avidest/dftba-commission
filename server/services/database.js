import {Builder}            from 'sequelize-classes';
import Order                from '../models/order';
import OrderLineItem        from '../models/order-line-item';
import Product              from '../models/product';
import ProductImage         from '../models/product-image';
import ProductVariant       from '../models/product-variant';
import Commission           from '../models/commission';
import UserProfile          from '../models/user-profile';

const databaseLogging = process.env.DATABASE_LOGGING

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

if (process.env.NODE_ENV === 'production') {
  options.config.logging = false
}

const database = new Builder(options, [
  Order,
  OrderLineItem,
  Commission,
  Product,
  ProductImage,
  ProductVariant,
  UserProfile
])

export default database

export async function sync(force = false) {
  try {
    await database.sequelize.sync({ force })
    console.log(`Database synced... ${force ? 'with force!' : ''}`)
    let {Product, UserProfile, Order} = database

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

  } catch(e) {
    console.error(e)
  }
}