import { map, reduce, includes, every, find } from 'lodash'
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
const {Webhooks} = resources

export default resources

const webhookTopics = [
  'products/create',
  'products/update',
  'products/delete',
  'orders/create',
  'orders/cancelled', 
  'orders/delete', 
  'orders/updated'
]

export function setup() {
  removeWebhooks().then(x => {
  installWebhooks()
  })
}

export function installWebhooks() {
  console.log('Trying to install webhooks...')
  return webhooksInstalled().then((installed)=> {
    if (installed) {
      return true
    }
    let calls = [];
    if (!installed) {
      calls = map(webhookTopics, (topic)=> {
        let address = `https://${process.env.APP_HOST}/api/v1/shopify/${topic}`;
        console.log(address)
        return Webhooks.create({
          address: address,
          topic: topic,
          format: 'json'
        })
      })
    }
    return batchCallIsSuccessful(calls)
  }).then(success => {
    if (success) {
      console.log('Webhooks installed...')
    } else {
      console.error('Webhooks failed to install...')
    }
  }).catch(err => console.log(err))
}

export function removeWebhooks() {
  return Webhooks.findAll({ complete: true }).then((webhooks)=> {
    let calls = map(webhooks, (webhook)=> {
      return Webhooks.remove(webhook.get('id'))
    });
    return batchCallIsSuccessful(calls)
      .then(x => {
        if (x) console.log('Webhooks removed...')
        return x
      })
  })
}

export function webhooksInstalled() {
  return Webhooks.findAll({ complete: true }).then((webhooks)=> {
    console.log(webhooks)
    if (!webhooks.length) return false;
    if (webhookTopics.length !== webhooks.length) {
      console.log('Removing webhooks... ')
      return removeWebhooks()
    }

    let installedHooks = map(webhooks, w => w.get('topic'))
    return every(webhookTopics, (topic)=> {
      return includes(installedHooks, topic);
    });
  })
}

export function batchCallIsSuccessful(promises) {
  return Promise.all(promises)
    .then((results)=> {
      return true;
    })
    .catch((err)=> {
      console.log(err.stack || err)
      return false;
    })
}
