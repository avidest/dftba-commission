import {Router} from 'express'
import database from '../services/database'
import permissions from '../middleware/permissions'

import UserProfiles     from './users'
import Products         from './products'
import Commissions      from './commissions'
import Transactions     from './transactions'
import Shopify          from './shopify'

const router = Router()
export default router

let shopify = new Shopify()
let products = new Products({ database })
let commissions = new Commissions({ database })
let transactions = new Transactions({ database })
let users = new UserProfiles({ database, name: 'UserProfile' })

router.use('/users', users.handler())
router.use('/products', products.handler())
router.use('/transactions', transactions.handler())
router.use('/commissions', commissions.handler())
router.use('/shopify', shopify.handler())

