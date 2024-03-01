import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { EMAIL_USER, EMAIL_PASSWORD } from '../config'

export enum MailTemplate {
  emailVerify = 'Email Verify Requested',
  changePassword = 'Password Change Requested',
  passwordResetRequested = 'Password Reset Requested',
  staffInvitation = 'You have been Invited To CloudReport',
  passwordUpdated = 'Password Updated',
  welcome = 'welcome',
  newPayment = 'You have a new pending payment'
}

const templates = {
  [MailTemplate.emailVerify]: 'email-verify.html',
  [MailTemplate.changePassword]: 'change-password-verify.html',
  [MailTemplate.welcome]: 'welcome.html',
  [MailTemplate.staffInvitation]: 'invitation.html',
  [MailTemplate.passwordResetRequested]: 'reset-password-request.html',
  [MailTemplate.passwordUpdated]: 'password-updated.html',
  [MailTemplate.newPayment]: 'new-payment.html'
  
}

class MailService {
  async sendTemplate<IArgs>(
    template: MailTemplate,
    subject: string,
    user: { name?: string; email: string },
    args?: IArgs
  ) {
    let argsData = args ? args : {}

    console.log("entered func")

    // Retrieve Markup
    let templateMarkup: string = fs.readFileSync(
      path.join(__dirname, `../templates/${templates[template]}`),
      'utf8'
    )

    // Replace markup keys
    Object.entries({
      ...user,
      ...(argsData as Record<string, any>),
    }).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      templateMarkup = templateMarkup.replace(regex, value)
    })
    console.log("replaced succeful")
    const mailOptions = {
      from: EMAIL_USER,
      to: user.email,
      subject,
      html: templateMarkup,
    }

    try {
      console.log("trying to send")
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        },
      })
      await transporter.sendMail(mailOptions)
      console.log("replaced sent succefull")
    } catch (err) {
      console.log(err)
    }
  }
}

const service = new MailService()

export default service