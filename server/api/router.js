import {Router} from 'express'
import permissions from '../middleware/permissions'
import Users from './users'

const router = Router()
export default router


let users = new Users()
router.use('/users', users.handler())

