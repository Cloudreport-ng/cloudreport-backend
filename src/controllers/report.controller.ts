import { Request, Response } from 'express'

import ReportService from '../services/report.service'

import response from '../utils/response'

class ReportController {

  async upload(req: Request, res: Response) {
    const result = await ReportService.upload(req.school.id,req.body)
    res.status(201).send(response('added', result))
  }

}

export default new ReportController()