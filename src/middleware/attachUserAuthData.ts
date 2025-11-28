import type {Request, Response, NextFunction} from 'express'
import {getUserWithPermissions} from '../services/userService.js'

const attachUserAuthData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.userId
        if (!userId) {
            return res.status(401).json({error: 'Unauthorized'})
        }

        const user = await getUserWithPermissions(userId)
        if (!user) {
            return res.status(401).json({error: 'Invalid user'})
        }

        req.user = user
        next()
    } catch (err) {
        next(err)
    }
}

export {attachUserAuthData}
