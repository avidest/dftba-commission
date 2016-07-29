import {Router} from 'express'
import database from '../services/database'
import permissions from '../middleware/permissions'

import Users from './users'
import Products from './products'
import Commissions from './commissions'

const router = Router()
export default router


let users = new Users()
let products = new Products({ database })
let commissions = new Commissions({ database })

router.use('/users', users.handler())
router.use('/products', products.handler())
router.use('/commissions', commissions.handler())

