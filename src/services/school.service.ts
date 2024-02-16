import { PrismaClient, TOKEN_TYPE } from "@prisma/client";

const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto, { Verify } from 'crypto'
import ms from 'ms'
import { customAlphabet } from 'nanoid'

import MailService, { MailTemplate } from './mail.service'


import CustomError from '../utils/custom-error'



class SchoolService {
    async inviteStaff(data: InviteInput) {
        if (data.emails.length < 1) throw new CustomError('email list empty', 400)
        if (!data.schoolId) throw new CustomError('schoolId is required', 400)

        const src = await prisma.user.findFirst({
            where: {
                id: data.userId
            },
            select: {
                first_name: true,
                Staff: {
                    where: {
                        role: "OWNER"
                    },
                    select: {
                        id: true,
                        role: true,
                        title: true,
                        school: true
                    }
                }
            }
        })
        if (!src?.Staff) throw new CustomError('school not found', 404)
        let found: boolean = false
        for (const staff of src?.Staff) {
            if (staff.school.id === data.schoolId) {
                found = true

                let staffs = await prisma.staff.findMany({
                    where: {
                        school_id: data.schoolId
                    }
                })

                if (staffs.length >= 3) throw new CustomError('max number of staffs reached', 400)

                if ((staffs.length + data.emails.length) > 3) throw new CustomError('you can only have 3 users in your school', 400)

                for (const email of data.emails) {
                    const oldUser = await prisma.user.findFirst({
                        where:
                        {
                            email
                        }
                    })
                    let state = ""

                    if (!oldUser) {
                        let newUser = await prisma.user.create({
                            data: {
                                email: email,
                                role: "USER"
                            }
                        })
                        state = newUser.id
                    } else {
                        state = oldUser.id
                    }

                    let newStaff = await prisma.staff.create({
                        data: {
                            school_id: data.schoolId,
                            user_Id: state,
                            role: "STAFF",
                            title: "Exam Officer"
                        }
                    })

                    //generateSetupLink
                    //.......

                    //send notification
                    await MailService.sendTemplate<{ link: string, school:string }>(
                        MailTemplate.staffInvitation,
                        'You have been invited to cloudreport',
                        { email: email },
                        { link:"www.google.com",school:staff.school.name }
                    )
                }
            }
        }
        if (!found) throw new CustomError('school not found', 404)

        return true
    }

}

export default new SchoolService()