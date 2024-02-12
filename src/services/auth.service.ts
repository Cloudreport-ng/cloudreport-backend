import { PrismaClient, TOKEN_TYPE } from "@prisma/client";

const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto, { Verify } from 'crypto'
import ms from 'ms'
import { customAlphabet } from 'nanoid'

import MailService, { MailTemplate } from './mail.service'


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

    async login(data: LoginInput) {
        if (!data.email) throw new CustomError('email is required', 400)
        if (!data.password) throw new CustomError('Password is required', 400)


        let user = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        })

        if (!user) throw new CustomError('invalid email or password', 400)

        if (!user.password) throw new CustomError('invalid email or password', 400)

        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) throw new CustomError('invalid email or password', 400)

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
                type: "VERIFY_EMAIL",
                token: hash,
                expire_at: new Date(Date.now() + ms('2h')),

            }
        })

        await MailService.sendTemplate<{ otp: string | number }>(
            MailTemplate.emailVerify,
            'Verify  your email address',
            { email: user.email },
            { otp }
        )

        // sends template

        return true
    }

    async verifyEmail(data: VerifyEmailInput) {
        if (!data.otp) throw new CustomError('otp is required', 400)
        if (!data.userId) throw new CustomError('user is required', 400)

        let user = await prisma.user.findUnique({
            where: {
                id: data.userId
            },
            select: {
                id: true,
                email_verified: true,
                Tokens: {
                    where: {
                        type: "VERIFY_EMAIL",
                    },
                }

            }
        })
        if (!user) throw new CustomError('user with email not found', 400)

        if (user.email_verified) throw new CustomError('email is already verified', 200)



        if (user.Tokens.length < 1) throw new CustomError("otp expired", 400)

        data.otp = String(data.otp)

        const isValid = await bcrypt.compare(data.otp, user.Tokens[0].token)

        if (!isValid) throw new CustomError('invalid or expired email verify otp', 400)

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                email_verified: new Date(Date.now())
            }
        })

        await prisma.token.delete({ where: { id: user.Tokens[0].id } })

        return true
    }

    async finishOnboarding(data: SetupInput) {
        if (!data.firstName) throw new CustomError('first name is required', 400)
        if (!data.lastName) throw new CustomError('last name is required', 400)
        if (!data.schoolName) throw new CustomError('school name is required', 400)
        if (!data.schoolAddress) throw new CustomError('school address is required', 400)


        const checker = await prisma.user.findFirst({
            where: {
                id: data.userId
            },
            select: {
                Staff: {
                    where: {
                        role: "OWNER"
                    },
                    select: {
                        role: true,
                        title: true,
                        school: true
                    }
                }
            }
        })


        if (checker?.Staff && checker?.Staff.length > 0) throw new CustomError('Youre Already onboard', 400)

        await prisma.user.update({
            where: {
                id: data.userId
            },
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
                updated_at: new Date(Date.now())
            }
        })

        const school = await prisma.school.create({
            data: {
                name: data.schoolName,
                address: data.schoolAddress
            }
        })

        const staff = await prisma.staff.create({
            data: {
                user_Id: data.userId,
                school_id: school.id,
                role: "OWNER",
                title: "OWNER"
            }
        })

        const full = await prisma.user.findFirst({
            where: {
                id: data.userId
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                Staff: {
                    where: {
                        role: "OWNER"
                    },
                    select: {
                        role: true,
                        title: true,
                        school: true
                    }
                }
            }
        })

        return full
    }

    async refreshAccessToken(data: RefreshTokenInput) {
        console.log("ABCD")        
        const { refreshToken: refreshTokenjsonwebtoken } = data

        const decoded: any = jsonwebtoken.verify(
            refreshTokenjsonwebtoken,
            JWT.REFRESH_SECRET
        )
        const { userId, refreshToken } = decoded

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        console.log('user')
        if (!user) throw new CustomError('User does not exist', 400)

        const RTokens = await prisma.token.findMany({
            where: {
                user_Id: userId,
                type: TOKEN_TYPE.REFRESH_TOKEN
            }
        })
        console.log(RTokens.length)
        if (RTokens.length < 1) throw new CustomError('invalid or expired refresh token', 400)

        let tokenExists:boolean = false

        for (const token of RTokens) {
            console.log("first itteration")
            const isValid = await bcrypt.compare(refreshToken, token.token)

            if (isValid) {
                tokenExists = true
                break
            }
        }

        if (!tokenExists) throw new CustomError('invalid or expired refresh token', 400)

        const accessToken = jsonwebtoken.sign(
            { id: user.id, role: user.role },
            JWT.JWT_SECRET,
            { expiresIn: '1h' }
        )
        console.log("returning")
        console.log(accessToken)

        return accessToken
    }


}

export default new AuthService()