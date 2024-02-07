import mongoose, { Model, Schema, Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import { uploadImage } from '../utils/image'
import { BCRYPT_SALT } from '../config'
import { Roles } from '../types/dynamic'

export interface IPublicUser {
  name: string
  email: string
  image: string
  ownerName: string
  ownerPhoneNumber: string
  ownerPhoneCountryCode: string
  ownerEmail: string
  businessCAC: number
  businessCertificate: string
  isBusinessVerified: boolean
  pin: string
  password: string | undefined
  isVerified: boolean
  isActive: boolean
  isPinSet: boolean
  isPasswordSet: boolean
  role: Roles
}
export interface IUser extends IPublicUser {
  pin: string
  password: string | undefined
}

export interface IUserDocument extends IUser, mongoose.Document {
  setProfileImage(image: Buffer): Promise<void>
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required for this business'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },

    pin: String,
    password: String,
    image: String,

    ownerPhoneNumber: String,
    ownerPhoneCountryCode: String,
    ownerEmail: String,
    ownerName: String,

    businessCAC: Number,
    businessCertificate: String,
    isBusinessVerified: Boolean,

    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
    },
  },
  { timestamps: true }
)

UserSchema.virtual('isPasswordSet').get(function () {
  return !!this.password
})

UserSchema.virtual('isPinSet').get(function () {
  return !!this.pin
})

UserSchema.methods.setProfileImage = async function (image: Buffer) {
  const result = (await uploadImage(image)) as { secure_url: string }
  if (result) {
    console.log(result.secure_url)
    this.image = result.secure_url
  }
}

UserSchema.pre('save', async function (next) {
  // hashes pin if pin is modified
  if (!this.isModified('pin')) return next()

  const hash = await bcrypt.hash(this.pin, BCRYPT_SALT)
  this.pin = hash

  next()
})

export default mongoose.model<IUserDocument>('user', UserSchema)