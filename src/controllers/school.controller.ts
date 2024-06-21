import { Request, Response } from 'express'

import SchoolService from '../services/school.service'

import response from '../utils/response'

class SchoolController {

  async getSettingsDashboard(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.settingsDashboard({ schoolId, userId: req.user.id })
    res.status(201).send(response('', result))
  }

  async getSettingsClasses(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.settingsClasses(schoolId)
    res.status(201).send(response('', result))
  }

  async getSettingsPayments(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.settingsPayments(schoolId)
    res.status(201).send(response('', result))
  }

  async getSchool(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.getSchool(schoolId)
    res.status(201).send(response('', result))
  }

  async getStaff(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.getStaff(schoolId)
    res.status(201).send(response('', result))
  }

  async inviteStaff(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.inviteStaff({ schoolId, ...req.body })
    res.status(201).send(response('invited succesfully', result))
  }

  async deleteInvite(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.deleteInvite({ schoolId, ...req.body })
    res.status(201).send(response('invitation deleted', result))
  }

  async deleteStaff(req: Request, res: Response) {
    const schoolId = req.school.id
    const result = await SchoolService.deleteStaff({ schoolId, ...req.body })
    res.status(201).send(response('staff removed', result))
  }


  async editSchool(req: Request, res: Response) {
    const result = await SchoolService.editSchool({ schoolId: req.school.id, ...req.body })
    res.status(201).send(response('Edited', result))
  }


  async createClass(req: Request, res: Response) {
    const result = await SchoolService.createClass({ schoolId: req.school.id, ...req.body })
    res.status(201).send(response('created', result))
  }
  async editClass(req: Request, res: Response) {
    const result = await SchoolService.editClass({ schoolId: req.school.id, ...req.body })
    res.status(201).send(response('Edited', result))
  }


  async createSession(req: Request, res: Response) {
    const result = await SchoolService.createSession({ schoolId: req.school.id, ...req.body })
    res.status(201).send(response('created', result))
  }
  async editSession(req: Request, res: Response) {
    const result = await SchoolService.editSession({ schoolId: req.school.id, ...req.body })
    res.status(201).send(response('Edited', result))
  }


  async changeCurrentSession(req: Request, res: Response) {
    const result = await SchoolService.changeCurrentSession({ schoolId: req.school.id, ...req.body })
    res.status(201).send(response('changed', result))
  }


  async purchaseSlots(req: Request, res: Response) {
    const result = await SchoolService.purchaseSlots({ schoolId: req.school.id, sessionId: req.school.current_session, ...req.body })
    res.status(201).send(response('your payment will be confirmed shortly', result))
  }

}

export default new SchoolController()