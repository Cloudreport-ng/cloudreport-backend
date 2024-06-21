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

  async approvePayment(req: Request, res: Response) {
    const paymentId = req.body.paymentId
    const result = await RootService.approvePayment(paymentId)
    res.status(201).send(response('approved', result))
  }

  async setPrice(req: Request, res: Response) {
    const result = await RootService.setPrice(req.body)
    res.status(201).send(response('updated', result))
  }

  async activeSchools(req: Request, res: Response) {
    const result = await RootService.activeSchools()
    res.status(201).send(response('active', result))
  }

  async inactiveSchools(req: Request, res: Response) {
    const result = await RootService.inactiveSchools()
    res.status(201).send(response('inactive', result))
  }

  async activateSchool(req: Request, res: Response) {
    const result = await RootService.activateSchool(req.body.schoolId)
    res.status(201).send(response('activated', result))
  }

  async deactivateSchool(req: Request, res: Response) {
    const result = await RootService.deactivateSchool(req.body.schoolId)
    res.status(201).send(response('deactivated', result))
  }

  async pendingPayments(req: Request, res: Response) {
    const result = await RootService.getPendingPayments()
    res.status(201).send(response('', result))
  }

  async approvedPayments(req: Request, res: Response) {
    const result = await RootService.getApprovedPayments()
    res.status(201).send(response('', result))
  }

  async settingsPayments(req: Request, res: Response) {
    const result = await RootService.settingsPayments()
    res.status(201).send(response('', result))
  }
}

export default new RootController()