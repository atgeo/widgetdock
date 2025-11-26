import {Widget, User} from '../db/schema'

declare module 'express-serve-static-core' {
    interface Request {
        widget?: Widget | null
        user?: User | null
    }
}
