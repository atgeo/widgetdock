import type {Request, Response, NextFunction} from 'express'

export const requirePermission = (...permissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user
        if (!user || !permissions.every((perm) => user.permissions?.includes(perm))) {
            return res.status(403).json({error: 'Forbidden'})
        }
        next()
    }
}
