import { Router } from 'express'
import {auth, schoolAuth} from '../middlewares/auth.middleware'
import { ROLE, SCHOOL_ROLE } from '../config'

import rootController from '../controllers/root.controller'
import { Roles, SchoolRoles } from '../types/dynamic'


const router = Router()

router.post('/add-account',auth(ROLE[Roles.admin], true), rootController.addAccount)
router.post('/fix-app',auth(ROLE[Roles.admin], true), rootController.fixApp)
router.put('/set-price',auth(ROLE[Roles.admin], true), rootController.setPrice)
router.put('/edit-account',auth(ROLE[Roles.admin], true), rootController.editAccount)
router.delete('/delete-account',auth(ROLE[Roles.admin], true), rootController.deleteAccount)


export default router