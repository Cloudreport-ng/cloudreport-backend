import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import ms from 'ms'
import { customAlphabet } from 'nanoid'

import  MailService, { MailTemplate } from './mail.service'


import CustomError from '../utils/custom-error'

import { JWT, BCRYPT_SALT } from '../config'


class AuthService {
    async register(data: SignupInput) {
        if (!data.email) throw new CustomError('email is required', 400)
        if (!data.password) throw new CustomError('Password is required', 400)


        let oldUser = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        })

        if (oldUser) throw new CustomError('user with email already exists', 400)

        const hash = await bcrypt.hash(data.password, BCRYPT_SALT);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hash,
                role: 'USER', // Assuming 'USER' role for the user
            },
        });

        await this.requestEmailVerification(user.email)

        // Generate Auth tokens
        const authTokens = await this.generateAuthTokens({
            userId: user.id,
            role: user.role,
        })

        return { user, token: authTokens }
    }

    async generateAuthTokens(data: GenerateTokenInput) {
        const { userId, role } = data

        const accessToken = jsonwebtoken.sign(
            { id: userId, role },
            JWT.JWT_SECRET,
            { expiresIn: '1h' }
        )

        const refreshToken = crypto.randomBytes(32).toString('hex')
        const hash = await bcrypt.hash(refreshToken, BCRYPT_SALT)

        const refreshTokenjsonwebtoken = jsonwebtoken.sign(
            { userId, refreshToken },
            JWT.REFRESH_SECRET,
            { expiresIn: '30d' }
        )

        await prisma.token.create({
            data: {
                user_Id: userId,
                type: "REFRESH_TOKEN",
                token: hash,
                expire_at: new Date(Date.now() + ms('30 days')),

            },
        });

        return { accessToken, refreshToken: refreshTokenjsonwebtoken }
    }

    async requestEmailVerification(email: string) {
        if (!email) throw new CustomError('email is required', 400)

        let user = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!user) throw new CustomError('user with email not found', 400)

        if (user.email_verified) throw new CustomError('email is already verified', 200)


        const oldToken = await prisma.token.findFirst({
            where: {
                type: "VERIFY_EMAIL",
                user_Id: user.id,
            }
        })
        if (oldToken) await prisma.token.delete({ where: { id: oldToken.id } })

        const nanoidOTP = customAlphabet('012345789', 6)
        const otp = nanoidOTP()

        const hash = await bcrypt.hash(otp, BCRYPT_SALT)

        await prisma.token.create({
            data: {
                user_Id: user.id,
                type:  "VERIFY_EMAIL",
                token: hash,
                expire_at: new Date(Date.now() + ms('2h')),

            }
        })

        await MailService.sendTemplate<{ otp: string | number }>(
            MailTemplate.emailVerify,
            'Verify  your email address',
            { email },
            { otp }
        )

        // sends template

        return true
    }

}

export default new AuthService()