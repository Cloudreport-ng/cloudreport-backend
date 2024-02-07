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


}

export default new AuthController()