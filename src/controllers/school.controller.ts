import { Request, Response } from 'express'

import SchoolService from '../services/school.service'

import response from '../utils/response'

class SchoolController {


  async inviteStaff(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.inviteStaff({schoolId, ...req.body})
    res.status(201).send(response('invited succesfully', result))
  }

  async deleteInvite(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.deleteInvite({schoolId, ...req.body})
    res.status(201).send(response('invitation deleted', result))
  }

  async deleteStaff(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.deleteStaff({schoolId, ...req.body})
    res.status(201).send(response('staff removed', result))
  }


  async editSchool(req: Request, res: Response) {
    const result = await SchoolService.editSchool({schoolId: req.school.id, ...req.body})
    res.status(201).send(response('Edited', result))
  }


  async createClass(req: Request, res: Response) {
    const result = await SchoolService.createClass({schoolId: req.school.id, ...req.body})
    res.status(201).send(response('created', result))
  }
  async editClass(req: Request, res: Response) {
    const result = await SchoolService.editClass({schoolId: req.school.id, ...req.body})
    res.status(201).send(response('Edited', result))
  }


  async createSession(req: Request, res: Response) {
    const result = await SchoolService.createSession({schoolId: req.school.id, ...req.body})
    res.status(201).send(response('created', result))
  }
  async editSession(req: Request, res: Response) {
    const result = await SchoolService.editSession({schoolId: req.school.id, ...req.body})
    res.status(201).send(response('Edited', result))
  }


  async changeCurrentSession(req: Request, res: Response) {
    const result = await SchoolService.changeCurrentSession({schoolId: req.school.id, ...req.body})
    res.status(201).send(response('changed', result))
  }

}

export default new SchoolController()