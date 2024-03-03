import { PrismaClient, TOKEN_TYPE } from "@prisma/client";

const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto, { Verify } from 'crypto'
import ms from 'ms'
import { customAlphabet } from 'nanoid'

import MailService, { MailTemplate } from './mail.service'


import CustomError from '../utils/custom-error'



class UserService {
    async me(data: MeInput) {
        if (!data.userId) throw new CustomError('ID error', 400)
        const user = await prisma.user.findFirst({
            where: {
                id: data.userId
            },
            select: {
                first_name: true,
                last_name: true,
                mobile: true,
                address: true,
                state: true,
                country: true,
                role: true,
                email: true,
            }
        })

        return user
    }

    async updateMe(data: MeUpdateInput) {
        if (!data.userId) throw new CustomError('ID error', 400)

        let update: any = {}

        if (data.firstName && data.firstName !== '') update.first_name = data.firstName
        if (data.lastName && data.lastName !== '') update.last_name = data.lastName
        if (data.mobile && data.mobile !== '') update.mobile = data.mobile
        if (data.address && data.address !== '') update.address = data.address
        if (data.state && data.state !== '') update.state = data.state

        await prisma.user.update({
            where: {
                id: data.userId
            },
            data: update
        })

        const user = await prisma.user.findFirst({
            where: {
                id: data.userId
            },
            select: {
                first_name: true,
                last_name: true,
                mobile: true,
                address: true,
                state: true,
                country: true,
                role: true,
                email: true,
                Staff: {
                    select: {
                        role: true,
                        title: true,
                        school: true
                    }
                }
            }
        })

        return user
    }

}

export default new UserService()