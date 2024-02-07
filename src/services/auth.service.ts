import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
// import ms from 'ms'
// import { customAlphabet } from 'nanoid'

// import MailService, { MailTemplate } from './mail.service'
// import User from '../models/user.model'
// import Token, { Tokens } from '../models/token.model'

import CustomError from '../utils/custom-error'

import { JWT, BCRYPT_SALT, URL } from '../config'
import { where } from "sequelize";

// import { AccountTypes, Roles } from '../types/dymanic'
// import validator from '../utils/validator'
// import userService from './user.service'
// import { ServiceCategories } from '../utils/service-categories'

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


        // await MailService.sendTemplate<{}>(
        //   MailTemplate.welcome,
        //   'Welcome to Homely',
        //   { name: user.name, email: user.email },
        //   {}
        // )
        // await this.requestEmailVerification(user.email)

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

        // await new Token({
        //     user: userId,
        //     token: hash,
        //     type: Tokens.refreshToken,
        //     expiresAt: Date.now() + ms('30 days'),
        // }).save()

        return { accessToken, refreshToken: refreshTokenjsonwebtoken }
    }

}

export default new AuthService()