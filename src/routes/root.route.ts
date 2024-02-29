import { Router } from 'express'
import {auth, schoolAuth} from '../middlewares/auth.middleware'
import { ROLE, SCHOOL_ROLE } from '../config'

import rootController from '../controllers/root.controller'
import { Roles, SchoolRoles } from '../types/dynamic'


const router = Router()

router.post('/add-account',auth(ROLE[Roles.admin], true), rootController.addAccount)


export default router