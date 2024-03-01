import { PAYMENT_STATUS, PrismaClient, TOKEN_TYPE } from "@prisma/client";

const prisma = new PrismaClient();
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto, { Verify } from 'crypto'
import ms from 'ms'
import { customAlphabet } from 'nanoid'

import MailService, { MailTemplate } from './mail.service'

import { URL } from '../config'


import CustomError from '../utils/custom-error'
import { Roles, SchoolRoles } from "../types/dynamic";
import { INTEGER } from "sequelize";

// Regular expression to match MongoDB ObjectId format
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
    return objectIdPattern.test(id);
}


class SchoolService {
    async editSchool(data: EditSchoolInput) {

        let raw: any = {}

        if (data.name && data.name !== "") raw.name = data.name
        if (data.address && data.address !== "") raw.address = data.address

        await prisma.school.update({
            where: {
                id: data.schoolId
            },
            data: {
                updated_at: new Date(Date.now()),
                ...raw
            }
        })
        return true
    }

    async inviteStaff(data: InviteInput) {
        // check if email list is empty,
        if (data.emails.length < 1) throw new CustomError('email list empty', 400)

        // get d number of staffs in the school
        let school = await prisma.school.findFirst({
            where: {
                id: data.schoolId
            },
            select: {
                name: true,
                staffs: true,
                invites: true
            }
        })
        if (!school) throw new CustomError('something went wrong', 400)

        // check if the length if the to  number of staves plus the intended addition plus existing invites exceeds the limit of the platform per school
        if ((school.staffs.length + school.invites.length + data.emails.length) > 3) throw new CustomError('max number of staffs exceeded', 400)

        // if not, for each of the emails on the list, 
        for (const email of data.emails) {
            //check if the user is alrady on the platform,
            const oldUser = await prisma.user.findFirst({
                where: { email }
            })
            if (oldUser) throw new CustomError('email address belongs to another account on the platform', 400)

        }

        // if not, for each of the emails on the list, 
        for (const email of data.emails) {
            ///create unique string for the ijnvitation
            const inviteToken = crypto.randomBytes(32).toString('hex')

            /// create the invite object for the email, and 
            await prisma.invite.create({
                data: {
                    school_id: data.schoolId,
                    email: email,
                    token: inviteToken,
                    role: SchoolRoles.staff
                }
            })

            //send the user an email notification with the sign up link
            MailService.sendTemplate<{ link: string, school: string }>(
                MailTemplate.staffInvitation,
                'You have been invited to cloudreport',
                { email: email },
                { link: `${URL.CLIENT_URL}/invitation/0283/${inviteToken}`, school: school.name }
            )

        }
        return true
    }

    async deleteInvite(data: DeleteInviteInput) {
        if (!data.inviteId) throw new CustomError('inviteId cannot empty', 400)
        if (!isValidObjectId(data.inviteId)) throw new CustomError('invalid inviteId', 401)

        const invite = await prisma.invite.findFirst({
            where: {
                id: data.inviteId,
                school_id: data.schoolId
            }
        })
        if (!invite) throw new CustomError('invite not found', 404)

        await prisma.invite.delete({
            where: {
                id: invite.id
            }
        })

        return true
    }

    async deleteStaff(data: DeleteStaffInput) {
        if (!data.staffId) throw new CustomError('staffId cannot empty', 400)
        if (!isValidObjectId(data.staffId)) throw new CustomError('invalid staffId', 401)

        const staff = await prisma.staff.findFirst({
            where: {
                id: data.staffId,
                school_id: data.schoolId,
                role: SchoolRoles.staff
            }
        })
        if (!staff) throw new CustomError('staff not found', 404)

        await prisma.staff.delete({
            where: {
                id: staff.id
            }
        })

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
        if ((!data.students && data.students != 0) || typeof (data.students) !== "number") throw new CustomError('number of students must be specified', 400)

        const src = await prisma.session.findFirst({
            where: {
                name: data.name,
                school_id: data.schoolId
            },
        })

        if (src) throw new CustomError('session already exist', 404)

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

    async purchaseSlots(data: PurchaseSlotsInput) {
        if (!data.sessionId || data.sessionId == "") throw new CustomError('current session not set', 400)
        if (!data.payerName || data.payerName == "") throw new CustomError("specify payer's name", 400)
        if (!data.slots || data.slots == 0) throw new CustomError('number of slots must be specified', 400)

        //check reqy=uired input,


        // find current price of slots,
        const site = await prisma.site.findFirst({})
        if(!site) throw new CustomError('site error',500)

console.log(site)
        const price: number = site.price
        // find current session

        const session = await prisma.session.findFirst({
            where: {
                id:data.sessionId,
                school_id:data.schoolId
            },
            select:{
                id:true,
                school: true
            }
        })

        if (!session) throw new CustomError('current session not specified', 404)
        //determine amount

        const amount = data.slots * price
        console.log(amount)
        // create payment
        const newPayment = await prisma.payment.create({
            data:{
                slots:data.slots,
                amount: String(amount),
                payer_name: data.payerName,
                status: PAYMENT_STATUS.PENDING,
                session_id: data.sessionId,
                school_id: data.schoolId
            }
        })

        // notify platform admins

        const admins = await prisma.user.findMany({
            where:{
                role: Roles.admin
            }
        })
        if(admins.length> 0){
            for (const admin of admins) {

                await MailService.sendTemplate<{ link: string,amount: string, school: string }>(
                    MailTemplate.newPayment,
                    'You have a new pending payment',
                    { email: admin.email },
                    { link: `${URL.CLIENT_URL}/admin-dashboard`,amount: newPayment.amount, school: session.school.name }
                )
            }
        }

        return newPayment
    }

}

export default new SchoolService()