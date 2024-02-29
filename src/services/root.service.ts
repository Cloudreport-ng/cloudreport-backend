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
  async addAccount(data: AddAccountInput){
    if(!data.accountName) throw new CustomError("account name is required", 401)
    if(!data.accountNumber) throw new CustomError("account number is required", 401)
    if(!data.bank) throw new CustomError("bank is required", 401)


    const account = await prisma.account.create({
        data:{
            bank:data.bank,
            account_name: data.accountName,
            account_number: data.accountNumber
        }
    })
    return account
  }

}

export default new RootService()