import { Request, Response } from 'express'

import RootService from '../services/root.service'

import response from '../utils/response'

class RootController {

  async addAccount(req: Request, res: Response) {
    const result = await RootService.addAccount(req.body)
    res.status(201).send(response('added', result))
  }

}

export default new RootController()