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


class ReportService {
  async upload(school_id: string, data: UploadReportInput) {
    if (!data.term) throw new CustomError("term is required", 401)
    if (!data.class_id) throw new CustomError('class_id is required', 401)
    if (!data.session_id) throw new CustomError('session_id is required', 401)
    if (data.data.length < 1) throw new CustomError('data must not be empty', 401)

    const schclass = await prisma.class.findFirst({
      where: {
        id: data.class_id,
        school_id:school_id
      }
    })

    const session = await prisma.session.findFirst({
      where: {
        id: data.session_id,
        school_id:school_id
      }
    })
    if(!schclass) throw new CustomError('class not found', 404)

    data.data.forEach(item => {

    });
  }

}

export default new ReportService()