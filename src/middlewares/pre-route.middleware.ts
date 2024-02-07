import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'

import type { Application } from 'express'

const CORS_SETTINGS = {
  credentials: true,
  exposedHeaders: ['set-cookie'],
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
  ],
}

export default (app: Application) => {
  // Set Env File
  dotenv.config({
    path: path.resolve(__dirname, '..', '..', '.env'),
  })

  // enable CORS
  app.use(cors(CORS_SETTINGS))

  // Parse cookies
  app.use(cookieParser())

  // Tell express to recognize the incoming Request Object as a JSON Object
  app.use(express.json({ limit: '5mb' }))

  // Express body parser
  app.use(express.urlencoded({ limit: '5mb', extended: true }))

  return app
}