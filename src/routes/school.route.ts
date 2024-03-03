import { Router } from 'express'
import {auth, schoolAuth} from '../middlewares/auth.middleware'
import { ROLE, SCHOOL_ROLE } from '../config'

import schoolController from '../controllers/school.controller'
import { Roles, SchoolRoles } from '../types/dynamic'


const router = Router()

router.get('/settings-overview',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.staff]), schoolController.getSettingsDashboard)
router.get('/settings-school',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.staff]), schoolController.getSchool)
router.get('/settings-classes',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.staff]), schoolController.getSettingsClasses)






router.put('/edit-school',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.editSchool)
router.post('/invite-staff',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.inviteStaff)
router.delete('/delete-invite',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.deleteInvite)
router.delete('/remove-staff',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.deleteStaff)
router.post('/create-class',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.createClass)
router.post('/create-session',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.createSession)
router.post('/purchase-slots',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.purchaseSlots)
router.put('/change-current-session',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.changeCurrentSession)
router.put('/edit-class',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.editClass)
router.put('/edit-session',auth(ROLE[Roles.user], true), schoolAuth(SCHOOL_ROLE[SchoolRoles.owner]), schoolController.editSession)


export default router