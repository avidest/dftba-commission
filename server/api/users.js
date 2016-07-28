import {ManagementClient} from 'auth0'
import {Router, route} from 'laforge'

const authClient = new ManagementClient({
  token: process.env.AUTH0_MANAGE_TOKEN,
  domain: process.env.AUTH0_DOMAIN
})

export default class Users extends Router {

  @route('get', '/')
  getUsers(opts) {
    return authClient.users.getAll()
  }

  @route('get', '/:id')
  getUser(opts) {
    return authClient.users.get({ id: opts.params.id })
  }

  @route('put', '/:id')
  updateUser(opts) {
    let {
      email,
      password,
      app_metadata,
      user_metadata
    } = opts.body

    let payload = {}
    if (password) {
      payload.password = password
    } else {
      payload = {
        email,
        app_metadata,
        user_metadata
      }
    }

    return authClient.users.update({ id: opts.params.id }, payload)
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  @route('delete', '/:id')
  removeUser(opts) {
    return authClient.users.delete({ id: opts.params.id })
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  @route('post', '/')
  createUser(opts, http) {
    let {
      password,
      email,
      app_metadata,
      user_metadata
    } = opts.body
    return authClient.users.create({
      connection: 'Username-Password-Authentication',
      email,
      password,
      email_verified: true,
      app_metadata,
      user_metadata
    })
  }
}
