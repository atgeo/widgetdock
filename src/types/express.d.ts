import { Widget } from '../db/schema'

declare module 'express-serve-static-core' {
    interface Request {
        widget?: Widget | null
    }
}
