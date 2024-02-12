import { Request, Response } from 'express'

import AuthService from '../services/auth.service'

import response from '../utils/response'

import {
  BASE_COOKIE_OPTIONS,
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../config/web-cookies'

class AuthController {

  async register(req: Request, res: Response) {
    const result = await AuthService.register(req.body)
    res.cookie('__access', result.token.accessToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_LIFETIME,
    })
    res.cookie('__refresh', result.token.refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_LIFETIME,
    })
    res.status(201).send(response('account created succesfully', result))
  }

  async emailVerifyRequest(req: Request, res: Response) {
    await AuthService.requestEmailVerification(req.body.email)
    res.status(201).send(response(`email sent to ${req.body.email}`, null ))
  }

  async emailVerify(req: Request, res: Response) {
    const result = await AuthService.verifyEmail({
      userId: req.user.id,
      ...req.body,
    })
    res.status(200).send(response('email verified successfully', result))
  }

  async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body)
    res.cookie('__access', result.token.accessToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_LIFETIME,
    })
    res.cookie('__refresh', result.token.refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_LIFETIME,
    })
    res.status(201).send(response('login succeful', result))
  }

  async finishOnboarding(req: Request, res: Response) {
    const result = await AuthService.finishOnboarding({
      userId: req.user.id,
      ...req.body,
    })
    res.status(201).send(response('welcome onboard', result))
  }

  async refreshAuth(req: Request, res: Response) {
    const result = await AuthService.refreshAccessToken(req.body)
    res.status(200).send(response('Authorization refresh', result))
  }

}

export default new AuthController()