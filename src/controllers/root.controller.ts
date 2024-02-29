import { Request, Response } from 'express'

import RootService from '../services/root.service'

import response from '../utils/response'

class RootController {

  async addAccount(req: Request, res: Response) {
    const result = await RootService.addAccount(req.body)
    res.status(201).send(response('added', result))
  }

  async editAccount(req: Request, res: Response) {
    const result = await RootService.editAccount(req.body)
    res.status(201).send(response('updated', result))
  }

  async deleteAccount(req: Request, res: Response) {
    const result = await RootService.deleteAccount(req.body.accountId)
    res.status(201).send(response('deleted', result))
  }

  async fixApp(req: Request, res: Response) {
    const result = await RootService.fixApp()
    res.status(201).send(response('fixed', result))
  }

  async setPrice(req: Request, res: Response) {
    const result = await RootService.setPrice(req.body)
    res.status(201).send(response('updated', result))
  }
}

export default new RootController()