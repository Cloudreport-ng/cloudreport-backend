import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken'
import { ROLE, JWT } from './../config'
import CustomError from './../utils/custom-error'

import type { Request, Response, NextFunction } from 'express'

/**
 * If no role is passed the default role is user
 * @param  {any[]} roles List of roles allowed to access the route
 */

const auth = (roles: string[] = [], requiresVerifiedEmail = true) => {
    roles = roles.length > 0 ? roles : ROLE.USER
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization
            ? req.headers.authorization.split(' ')[1]
            : ''
        const cookieToken = req.cookies.__access

        if (!token && !cookieToken)
            throw new CustomError('unauthorized access: Token not found', 401)

        // Implementation allows for authorization to be read from req header and httpOnly cookie
        let decoded = null

        try {
            // attempts to verify header token
            decoded = jsonwebtoken.verify(token, JWT.JWT_SECRET) as JWTPayload
        } catch (err) { }

        // header token verifications failes ( decoded is stil null )
        if (decoded === null) {
            // attemps to verify cookie token
            try {
                if (cookieToken) {
                    decoded = jsonwebtoken.verify(
                        cookieToken,
                        JWT.JWT_SECRET
                    ) as JWTPayload
                } else {
                    // Cookie token undefined or missing
                    throw new CustomError(
                        'UnAuthorized Access: jsonwebtoken not provided',
                        401
                    )
                }
            } catch (err) {
                // Verification of token fails
                throw new CustomError(
                    'UnAuthorized Access: Failed to verify jsonwebtoken',
                    401
                )
            }
        }

        const user = await prisma.user.findUnique({
            where: { 
                id: decoded.id 
            },
        })

        if (!user) throw new CustomError('unauthorized access: User does not exist', 401)
        // if (!user.isActive) throw new CustomError('unauthorized access: User has been deactivated', 401)

        if (!user.email_verified && requiresVerifiedEmail)
            throw new CustomError(
                'unauthorized access: Please verify email address',
                401
            )
        if (!roles.includes(user.role))
            throw new CustomError('unauthorized access', 401)

        req.user = user
        next()
    }
}

export default auth