import jwt from 'jsonwebtoken'
import type {NextFunction, Request, Response} from 'express'
import {getUserById} from '../repositories/userRepository.js'

interface AuthRequest extends Request {
    user?: { userId: number; username: string }
}

const requireAuthView = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken
    const refreshSecret = process.env.JWT_REFRESH_SECRET
    const redirectTo = encodeURIComponent(req.originalUrl)

    if (!token || !refreshSecret) {
        return res.redirect(`/login?redirect=${redirectTo}`)
    }

    try {
        const payload = jwt.verify(token, refreshSecret) as { userId: number }
        const user = await getUserById(payload.userId)

        if (!user) {
            return res.redirect(`/login?redirect=${redirectTo}`)
        }

        req.user = {userId: user.id, username: user.username}
        return next()
    } catch (err) {
        return res.redirect(`/login?redirect=${redirectTo}`)
    }
}

export {requireAuthView}
