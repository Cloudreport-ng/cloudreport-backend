import { Router } from 'express'
import {auth, schoolAuth} from '../middlewares/auth.middleware'
import { ROLE, SCHOOL_ROLE } from '../config'

import rootController from '../controllers/root.controller'
import { Roles, SchoolRoles } from '../types/dynamic'


const router = Router()

router.get('/active-schools',auth(ROLE[Roles.admin], true), rootController.activeSchools)
router.get('/inactive-schools',auth(ROLE[Roles.admin], true), rootController.inactiveSchools)
router.get('/pending-payments',auth(ROLE[Roles.admin], true), rootController.pendingPayments)


router.post('/add-account',auth(ROLE[Roles.admin], true), rootController.addAccount)
router.put('/activate-school',auth(ROLE[Roles.admin], true), rootController.activateSchool)
router.put('/deactivate-school',auth(ROLE[Roles.admin], true), rootController.deactivateSchool)
router.post('/fix-app',auth(ROLE[Roles.admin], true), rootController.fixApp)
router.put('/set-price',auth(ROLE[Roles.admin], true), rootController.setPrice)
router.put('/edit-account',auth(ROLE[Roles.admin], true), rootController.editAccount)
router.delete('/delete-account',auth(ROLE[Roles.admin], true), rootController.deleteAccount)


export default router