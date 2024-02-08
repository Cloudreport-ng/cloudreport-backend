import * as dotenv from 'dotenv'
import { Roles } from '../types/dynamic'
dotenv.config()

export const ROLE = {
  [Roles.admin]: ['ADMIN'],
  [Roles.user]: ['USER',],
}

export const NODE_ENV = process.env.NODE_ENV || 'development'

export const JWT = {
  ACCESS_TOKEN_LIFETIME: '1hr',
  REFRESH_TOKEN_LIFETIME: '30d',
  JWT_SECRET: process.env.JWT_SECRET || 'aadd-233344-22vdfa',
  REFRESH_SECRET: process.env.JWT_SECRET || 'aadd-233344-22vdfa',
}

export const BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 10

export const URL = {
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
}

export const PORT = process.env.PORT || 8080

export const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homely'

export const EMAIL_USER = process.env.EMAIL_USER || 'metaproject0@gmail.com'
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || ''