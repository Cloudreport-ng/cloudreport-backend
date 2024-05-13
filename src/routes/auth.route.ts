import { Router } from 'express'
import Auth from '../middlewares/auth.middleware'
import { ROLE } from '../config'

import authController from '../controllers/auth.controller'
import { Roles } from '../types/dynamic'


const router = Router()

router.post('/signup', authController.register)

router.post(
  '/email-verify',
  Auth(ROLE[Roles.user], false),
  authController.emailVerify
)

router.post('/email-verify/request', authController.emailVerifyRequest)

router.post('/login', authController.login)

router.post(
  '/finish-onboarding',
  Auth(ROLE[Roles.user], true),
  authController.finishOnboarding
)

router.post(
  '/logout',
  Auth(ROLE[Roles.user], true),
  authController.logout
)

router.post('/refresh', authController.refreshAuth)

// router.get('/me', Auth(ROLE[Roles.user], false), authController.me)

// router.put(
//   '/me',
//   Auth(ROLE[Roles.user]),
//   upload.single('image'),
//   authController.updateMe
// )

router.post('/password/change/request',
  Auth(ROLE[Roles.user], true),
  authController.requestPasswordChange)

router.post('/password/change',
  Auth(ROLE[Roles.user], true),
  authController.changePassword)

// router.post('/password/reset', authController.resetPassword)

router.post('/password/reset/request', authController.requestPasswordReset)





export default router