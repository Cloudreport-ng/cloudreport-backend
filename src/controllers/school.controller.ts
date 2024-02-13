import { Request, Response } from 'express'

import SchoolService from '../services/school.service'

import response from '../utils/response'

class SchoolController {

  async inviteStaff(req: Request, res: Response) {
    const result = await SchoolService.inviteStaff(req.body)
    res.status(201).send(response('invited succesfully', result))
  }

}

export default new SchoolController()