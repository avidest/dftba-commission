import {Builder}            from 'sequelize-classes';
import Swatch               from './models/swatch';
import Swatchbook           from './models/swatchbook';
import Product              from './models/product';

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
  Swatch,
  Swatchbook,
  Product
])

export default database