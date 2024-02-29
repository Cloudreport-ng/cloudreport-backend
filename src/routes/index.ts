import { Router } from 'express'
import Auth from './auth.route'
import School from './school.route'
import User from './user.route'
import Root from './root.route'

const router = Router()

/**
 * Routes
 */
router.get('/', (_, res) => res.status(200).send("@c+1ve"))
router.use('/auth', Auth)
router.use('/school', School)
router.use('/user', User)
router.use('/root', Root)


export default router