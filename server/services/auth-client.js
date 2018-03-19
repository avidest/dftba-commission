import {ManagementClient} from 'auth0'

const client = new ManagementClient({
  token: process.env.AUTH0_MANAGE_TOKEN,
  domain: process.env.AUTH0_DOMAIN
})

export default client

export function getAllUsers() {
  var total = 0;
  var users = []
  var promises = []
  return getUsers({
    page: 0,
    limit: 100,
    include_totals: true
  }).then(resp => {
    if (resp.length < resp.total) {
      return resp.users;
    }
    total = resp.total
    users = users.concat(resp.users)
    let calls = Math.ceil(total / 100) - 1
    for (let i = 1; i <= calls; i++) {
      promises.push(getUsers({
        page: i,
        limit: 100
      }))
    }
    return Promise.all(promises)
  }).then(calls => {
    return calls.reduce((m, resp)=> {
      if (resp.length) {
        m = m.concat(resp)
      }
      return m
    }, users)
  })
  .catch(err => {
    console.log(err)
    throw err
  })
}

export function getUsers(opts = {}) {
  return client.users.getAll(opts)
  .catch(err => {
    console.log(err)
    throw err
  })
}

export function getUser(id) {
  return client.users.get({ id })
  .catch(err => {
    console.log(err)
    throw err
  })
}

export function createUser(data) {
  return client.users.create({
    ...data,
    connection: 'Username-Password-Authentication'
  })
  .catch(err => {
    console.log(err)
    throw err
  })
}

export function updateUser(id, data) {
  const {
    email,
    email_verified,
    password,
    app_metadata,
    user_metadata
  } = data

  const payload = !password
    ? { email, email_verified, app_metadata, user_metadata }
    : { password }

  return client.users.update({ id }, payload)
    .catch(err => {
      console.log(err)
      throw err
    })
}

export function deleteUser(id) {
  return client.users.delete({ id })
  .catch(err => {
    console.log(err)
    throw err
  })
}