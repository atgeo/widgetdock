import {expressjwt, UnauthorizedError} from 'express-jwt'
import type {Request, Response, NextFunction} from 'express'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined')
}

export const checkJwt = expressjwt({
    secret: jwtSecret,
    algorithms: ['HS256'],
})

export function jwtErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof UnauthorizedError) {
        return res.status(401).json({error: 'Invalid or missing token'})
    }
    next(err)
}
