import { Request, Response } from 'express'

import SchoolService from '../services/school.service'

import response from '../utils/response'

class SchoolController {

  async inviteStaff(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.inviteStaff({schoolId, ...req.body})
    res.status(201).send(response('invited succesfully', result))
  }

  async createClass(req: Request, res: Response) {
    const result = await SchoolService.createClass({schoolId: req.school.id, ...req.body})
    res.status(201).send(response('created', result))
  }

}

export default new SchoolController()