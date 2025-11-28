import {expressjwt, UnauthorizedError} from 'express-jwt'
import type {Request, Response, NextFunction} from 'express'

const jwtSecret = process.env.JWT_ACCESS_SECRET

if (!jwtSecret) {
    throw new Error('JWT_ACCESS_SECRET is not defined')
}

const checkJwt = expressjwt({
    secret: jwtSecret,
    algorithms: ['HS256'],
})

const jwtErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof UnauthorizedError) {
        return res.status(401).json({error: 'Invalid or missing token'})
    }
    next(err)
}

export {checkJwt, jwtErrorHandler}
