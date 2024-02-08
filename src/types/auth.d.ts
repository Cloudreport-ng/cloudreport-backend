interface SignupInput {
    email: string
    password: string
}

interface LoginInput {
    email: string
    password: string
}



interface GenerateTokenInput {
    userId: string
    role: string
}

interface VerifyEmailInput {
    userId: string
    otp: string | number
}

interface JWTPayload {
    id: string
    iat: number
    exp: number
    role: 'ADMIN' | 'USER'
  }