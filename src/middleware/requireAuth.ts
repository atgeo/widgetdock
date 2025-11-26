import jwt from 'jsonwebtoken'
import type {NextFunction, Request, Response} from 'express'

interface AuthRequest extends Request {
    user?: { userId: number; role?: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies.refreshToken
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!token || !refreshSecret) {
        return res.redirect('/login')
    }

    try {
        req.user = jwt.verify(token, refreshSecret) as { userId: number; role?: string }
        return next()
    } catch (err) {
        return res.redirect('/login')
    }
}
