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
import { SchoolRoles } from "../types/dynamic";
import { INTEGER } from "sequelize";

// Regular expression to match MongoDB ObjectId format
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return objectIdPattern.test(id);
}


class RootService {

  async addAccount(data: AddAccountInput) {
    if (!data.accountName) throw new CustomError("account name is required", 401)
    if (!data.accountNumber) throw new CustomError("account number is required", 401)
    if (!data.bank) throw new CustomError("bank is required", 401)


    const account = await prisma.account.create({
      data: {
        bank: data.bank,
        account_name: data.accountName,
        account_number: data.accountNumber
      }
    })
    return account
  }

  async editAccount(data: EditAccountInput) {
    if (!data.accountId) throw new CustomError("account id is required", 401)

    const acct = await prisma.account.findFirst({
      where: {
        id: data.accountId
      }
    })

    if (!acct) throw new CustomError('account not found', 401)
    let raw: any = {}

    if (data.accountName && data.accountName !== "") raw.account_name = data.accountName
    if (data.accountNumber && data.accountNumber !== "") raw.account_number = data.accountNumber
    if (data.bank && data.bank !== "") raw.bank = data.bank

    await prisma.account.update({
      where: {
        id: data.accountId
      },
      data: raw
    })

    return true
  }

  async deleteAccount(accountId: string) {
    if (!accountId) throw new CustomError("account id is required", 401)

    const acct = await prisma.account.findFirst({
      where: {
        id: accountId
      }
    })

    if (!acct) throw new CustomError('account not found', 401)

    await prisma.account.delete({
      where: {
        id: accountId
      }
    })

    return true
  }

  async fixApp() {
    const oldSites = await prisma.site.findMany()
    if (oldSites.length > 0) {
      await prisma.site.deleteMany()
    }

    const newSite = await prisma.site.create({
      data: {

      }
    })

    return true
  }

  async setPrice(data: SetPriceInput) {
    if (!data.price) throw new CustomError('price not defined', 401)

    let site = await prisma.site.findFirst()

    if (!site) {
      await this.fixApp()
      site = await prisma.site.findFirst()
    }

    if (!site) throw new CustomError('an error occured', 500)


    await prisma.site.update({
      where: {
        id: site.id
      },
      data: {
        price: data.price
      }
    })

    return true
  }

  async activeSchools() {
    const schools = await prisma.school.findMany({
      where: {
        active: true
      }
    })

    return schools
  }

  async inactiveSchools() {
    const schools = await prisma.school.findMany({
      where: {
        active: false
      }
    })

    return schools
  }

  async activateSchool(schoolId: string) {
    if (!schoolId) throw new CustomError('shool id not specified', 401)

    const school = await prisma.school.findFirst({
      where: {
        id: schoolId
      }
    })

    if (!school) throw new CustomError('school not found', 404)

    if (school.active) throw new CustomError('school is already active', 401)

    await prisma.school.update({
      where: {
        id: school.id
      },
      data: {
        active: true
      }
    })

    return true
  }

  async deactivateSchool(schoolId: string) {
    if (!schoolId) throw new CustomError('shool id not specified', 401)

    const school = await prisma.school.findFirst({
      where: {
        id: schoolId
      }
    })

    if (!school) throw new CustomError('school not found', 404)

    if (!school.active) throw new CustomError('school is already inactive', 401)

    await prisma.school.update({
      where: {
        id: school.id
      },
      data: {
        active: false
      }
    })

    return true
  }

  async getPendingPayments() {
    const payments = await prisma.payment.findMany({
      where: {
        status: PAYMENT_STATUS.PENDING,
      },
      select: {
        id: true,
        slots: true,
        amount: true,
        status: true,
        school: {
          select: {
            id: true,
            name: true
          }
        },
        session: {
          select: {
            id: true,
            name: true
          }
        },
        created_at: true,
        approved_at: true

      }
    })

    return payments.reverse()
  }
}

export default new RootService()