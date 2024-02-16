import { Router } from 'express'
import Auth from '../middlewares/auth.middleware'
import { ROLE } from '../config'

import userController from '../controllers/user.controller'
import { Roles } from '../types/dynamic'


const router = Router()

router.get('/me', Auth(ROLE[Roles.user], false), userController.me)

router.put(
  '/me',
  Auth(ROLE[Roles.user]),
  userController.updateMe
)


export default router