import { PrismaClient, TOKEN_TYPE } from "@prisma/client";

const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto, { Verify } from 'crypto'
import ms from 'ms'
import { customAlphabet } from 'nanoid'

import MailService, { MailTemplate } from './mail.service'


import CustomError from '../utils/custom-error'

// Regular expression to match MongoDB ObjectId format
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
    return objectIdPattern.test(id);
}


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
                    await MailService.sendTemplate<{ link: string, school: string }>(
                        MailTemplate.staffInvitation,
                        'You have been invited to cloudreport',
                        { email: email },
                        { link: "www.google.com", school: staff.school.name }
                    )
                }
            }
        }
        if (!found) throw new CustomError('school not found', 404)

        return true
    }

    async createClass(data: CreateClassInput) {
        if (!data.name || data.name == "") throw new CustomError('name cannot empty', 400)
        if (!data.colourCode || data.colourCode == 0) throw new CustomError('colour code is required', 400)

        const src = await prisma.class.findFirst({
            where: {
                name: data.name,
                school_id: data.schoolId
            },
        })

        if (src) throw new CustomError('class already exist', 404)

        const newClass = await prisma.class.create({
            data: {
                name: data.name,
                school_id: data.schoolId,
                colour_code: data.colourCode,

            }
        })

        return true
    }

    async createSession(data: CreateSessionInput) {
        if (!data.name || data.name == "") throw new CustomError('name cannot empty', 400)
        if (!data.students && data.students != 0) throw new CustomError('number of students must be specified', 400)

        const src = await prisma.session.findFirst({
            where: {
                name: data.name,
                school_id: data.schoolId
            },
        })

        if (src) throw new CustomError('class already exist', 404)

        const src2 = await prisma.session.findFirst({
            where: {
                school_id: data.schoolId
            },
        })
        const newSession = await prisma.session.create({
            data: {
                name: data.name,
                school_id: data.schoolId,
                total_students: data.students,
            }
        })

        if (!src2) {
            await prisma.school.update({
                where: {
                    id: data.schoolId
                },
                data: {
                    current_session: newSession.id,
                    updated_at: new Date(Date.now())
                }
            })
        }

        return true
    }

    async changeCurrentSession(data: AssignSessionInput) {
        if (!data.sessionId || data.sessionId == "") throw new CustomError('sessionId cannot empty', 400)

        if (!isValidObjectId(data.sessionId)) throw new CustomError('invalid sessionid', 401)

        const session = await prisma.session.findFirst({
            where: {
                id: data.sessionId,
                school_id: data.schoolId
            },
        })

        if (!session) throw new CustomError('session does not exist', 404)

        await prisma.school.update({
            where: {
                id: data.schoolId
            },
            data: {
                current_session: session.id,
                updated_at: new Date(Date.now())
            }
        })
        return true
    }

    async editSession(data: EditSessionInput) {
        if (!data.sessionId || data.sessionId == "") throw new CustomError('sessionId cannot empty', 400)

        if (!isValidObjectId(data.sessionId)) throw new CustomError('invalid sessionid', 401)

        const session = await prisma.session.findFirst({
            where: {
                id: data.sessionId,
                school_id: data.schoolId
            },
        })

        if (!session) throw new CustomError('session does not exist', 404)

        let raw: any = {}
        if (data.name && data.name !== "") raw.name = data.name
        if (data.students || data.students === 0) {
            if (!session.paid_students) session.paid_students = 0

            if (data.students < session.paid_students) throw new CustomError('cannot reduce number below what you already paid for', 401)
            raw.total_students = data.students
        }

        await prisma.session.update({
            where: {
                id: data.sessionId
            },
            data: {
                updated_at: new Date(Date.now()),
                ...raw
            }
        })
        return true
    }

    async editClass(data: EditClassInput) {
        if (!data.classId || data.classId == "") throw new CustomError('classId cannot empty', 400)

        if (!isValidObjectId(data.classId)) throw new CustomError('invalid classId', 401)

        const oldClass = await prisma.class.findFirst({
            where: {
                id: data.classId,
                school_id: data.schoolId
            },
        })

        if (!oldClass) throw new CustomError('class does not exist', 404)

        let raw: any = {}
        if (data.name && data.name !== "") raw.name = data.name
        if (data.colourCode && data.colourCode !== 0) raw.colour_code = data.colourCode
    
        await prisma.class.update({
            where: {
                id: data.classId
            },
            data: {
                updated_at: new Date(Date.now()),
                ...raw
            }
        })
        return true
    }

}

export default new SchoolService()