import { Router } from 'express'
import {auth, schoolAuth} from '../middlewares/auth.middleware'
import { ROLE, SCHOOL_ROLE } from '../config'

import schoolController from '../controllers/school.controller'
import { Roles, SchoolRoles } from '../types/dynamic'


const router = Router()

router.post('/invite-staff',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.inviteStaff)
router.post('/create-class',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.createClass)


export default router