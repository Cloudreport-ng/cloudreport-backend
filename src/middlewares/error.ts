import response from './../utils/response'

// Possible error names
const errorNames = [
  'CastError',
  'JsonWebTokenError',
  'ValidationError',
  'SyntaxError',
  'MongooseError',
  'MongoError',
]

import type { Application, Request, Response, NextFunction } from 'express'

export default (app: Application) => {
  app.use('*', (req: Request, res: Response) => {
    res.status(404).send(response('Invalid request', null, false))
  })

  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.name == 'CustomError') {
      res.status(error.status).send(response(error.message, null, false))
    }
  })

  return app
}