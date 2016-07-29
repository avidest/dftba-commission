import {
  ShopifyPrivateSession,
  ShopifyResources,
  ShopifyClient
} from 'shopify-tools'

export const session = new ShopifyPrivateSession({
  apiKey: process.env.SHOPIFY_APIKEY,
  secret: process.env.SHOPIFY_SECRET,
  password: process.env.SHOPIFY_PASSWORD,
  shop: process.env.SHOPIFY_SHOP,
  host: process.env.APP_HOST
})

export const client = new ShopifyClient({ session })

export const resources = new ShopifyResources({ client })

export default resources
