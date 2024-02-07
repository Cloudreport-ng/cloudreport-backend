import ms from 'ms'
import { NODE_ENV } from './'
import type { CookieOptions } from 'express'

export const ACCESS_TOKEN_LIFETIME = ms('1h')
export const REFRESH_TOKEN_LIFETIME = ms('30d')
export const BASE_COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true,
    secure: NODE_ENV !== 'development',
    sameSite: NODE_ENV !== 'development' ? 'none' : false,
    domain:
        NODE_ENV !== 'development' ? 'cloudreport.vercel.app' : 'localhost',
} as CookieOptions