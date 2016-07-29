import {ManagementClient} from 'auth0'

export default new ManagementClient({
  token: process.env.AUTH0_MANAGE_TOKEN,
  domain: process.env.AUTH0_DOMAIN
})
