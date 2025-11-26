import express from 'express'
import type {Request, Response} from 'express'

const router = express.Router()

router.get('/login', (_req: Request, res: Response) => {
    res.render('login')
})

export default router
