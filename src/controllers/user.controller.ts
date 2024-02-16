import { Request, Response } from 'express'

import UserService from '../services/user.service'

import response from '../utils/response'

class SchoolController {

    async me(req: Request, res: Response) {
        const result = await UserService.me({ userId: req.user.id })
        res.status(201).send(response('', result))
    }

    async updateMe(req: Request, res: Response) {
        const result = await UserService.updateMe({
            userId: req.user.id,
            ...req.body
        })
        res.status(201).send(response('Updated', result))
    }

}

export default new SchoolController()