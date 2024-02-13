import { Router } from 'express'
import Auth from '../middlewares/auth.middleware'
import { ROLE } from '../config'

import schoolController from '../controllers/school.controller'
import { Roles } from '../types/dynamic'


const router = Router()

router.post('/invite-staff', schoolController.inviteStaff)


export default router