import Shopify from '../services/shopify'
import Path from 'path'
import util from 'util'

import {
  BIGINT,
  BOOLEAN,
  INTEGER,
  STRING,
  TEXT,
  ARRAY,
  JSONB,
  JSON as JSONTYPE,
  DATE,
  VIRTUAL
} from 'sequelize'

import {
  Model,
  hasMany,
  hasOne,
  belongsTo,
  belongsToMany,
  beforeCreate,
  beforeValidate,
  multipleHooks,
  hook,
  afterDestroy
} from 'sequelize-classes'

@hasMany('ProductImage',    {as: 'images', foreignKey: 'product_id'})
@hasMany('ProductVariant',  {as: 'variants', foreignKey: 'product_id'})
@hasMany('Commission',      {as: 'commissions', foreignKey: 'product_id'})
export default class Product extends Model {

  id = { type: BIGINT, allowNull: false, unique: true, primaryKey: true };

  handle = { type: STRING, allowNull: false };

  options = { type: JSONB, allowNull: true };

  product_type = { type: STRING };

  published_scope = { type: STRING };

  published_at = { type: DATE };

  tags = {
    type: ARRAY(STRING),
    set(val) {
      let arr
      if (typeof val === 'string') {
        arr = val.split(',').map(x => x.trim()).sort()
      } else if (Array.isArray(val)) {
        arr = val.map(x => x.trim()).sort()
      } else {
        arr = val
      }
      this.setDataValue('tags', arr)
    }
  };

  title = { type: STRING };

  vendor = { type: STRING };

  static async downloadAll() {
    let {ProductImage, ProductVariant} = this.sequelize.models
    let sProducts = await Shopify.Products.findAll({complete: true})
    let products = sProducts.map(p => p.toObject())

    let variants = products.reduce((m, p)=> {
      if (p.variants) {
        m = m.concat(p.variants)
      }
      return m
    }, [])

    let images = products.reduce((m, p)=> {
      if (p.images) {
        m = m.concat(p.images)
      }
      return m
    }, [])

    return {
      products: (await this.bulkCreate(products)).length,
      variants: (await ProductVariant.bulkCreate(variants)).length,
      images: (await ProductImage.bulkCreate(images)).length
    }
  }

}