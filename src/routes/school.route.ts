import { Router } from 'express'
import {auth, schoolAuth} from '../middlewares/auth.middleware'
import { ROLE, SCHOOL_ROLE } from '../config'

import schoolController from '../controllers/school.controller'
import { Roles, SchoolRoles } from '../types/dynamic'


const router = Router()

router.put('/edit-school',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.editSchool)
router.post('/invite-staff',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.inviteStaff)
router.post('/delete-invite',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.deleteInvite)
router.post('/create-class',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.createClass)
router.post('/create-session',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.createSession)
router.put('/change-current-session',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.changeCurrentSession)
router.put('/edit-class',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.editClass)
router.put('/edit-session',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.editSession)


export default router