import Shopify from '../services/shopify'
import Path from 'path'
import util from 'util'
import find from 'lodash/find'
import md5 from 'md5'

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

  shopify_hash = { type: STRING };

  isFresh(sProduct) {
    if (this.shopify_hash === this.calculateHash(sProduct)) {
      return false
    }
    return true
  }

  calculateHash(sProduct) {
    return md5(JSON.stringify(sProduct))
  }

  updateHash(sProduct) {
    this.shopify_hash = this.calculateHash(sProduct)
    return this
  }

  async updateVariantsFromShopify(sVariants) {
    let variants = this.variants
    let updates = []
    if (!variants) {
      variants = await this.getVariants()
    }

    for (let sVar of sVariants) {
      let variant = find(variants, {id: sVar.id.toString()})
      // If variants exists, update it.
      if (variant) {
        variant.set(sVar)
        updates.push(variant.save())
      } 
      // If variant doesn't exist, create it
      else {
        updates.push(this.createVariant(sVar))
      }
    }

    for (let variant of variants) {
      // If variant exists locally but has been deleted in Shopify
      if (!find(sVariants, {id: parseInt(variant.id, 10)})) {
        updates.push(variant.destroy())
      }
    }

    return await Promise.all(updates)
  }

  async updateImagesFromShopify(sImages) {
    let images = this.images
    let updates = []
    if (!images) {
      images = await this.getImages()
    }

    for (let sImage of sImages) {
      let image = find(images, {id: sImage.id.toString()})
      // If image exists, update it.
      if (image) {
        image.set(sImage)
        updates.push(image.save())
      } 
      // If image doesn't exist, create it
      else {
        updates.push(this.createImage(sImage))
      }
    }

    for (let image of images) {
      // If image exists locally but has been deleted in Shopify
      if (!find(sImages, {id: parseInt(image.id, 10)})) {
        updates.push(image.destroy())
      }
    }

    return await Promise.all(updates)
  }

  static async createFromShopify(data) {
    return await this.create(data, { 
      include: [{all: true}] 
    })
  }

  static async updateFromShopify(data) {
    let {
      id,
      images,
      variants,
      ...update
    } = data

    let product = await this.findById(id, {
      include: [{all: true}]
    })

    if (product) {
      if (!product.isFresh(data)) {
        console.log('Product#updateFromShopify: ignoring update, data is stale.')
        return product
      }
      product.set(update)
      product.updateHash(data)
      let variantUpdates = product.updateVariantsFromShopify(variants)
      let imageUpdates = product.updateImagesFromShopify(images)
      return await Promise.all([
        variantUpdates,
        imageUpdates,
        product.save()
      ])
    }
    return product
  }

  static async destroyFromShopify(data) {
    let product = await this.findById(data.id)
    if (product) {
      return await product.destroy({ onDelete: 'CASCADE' })
    }
    return product
  }

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