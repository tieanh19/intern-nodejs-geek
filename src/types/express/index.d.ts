import { Request } from 'express'
import { JwtPayloadDto } from '~/dto/request/auth.dto'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
    data?: any
  }
}
