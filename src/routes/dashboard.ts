import express from 'express'
import type {Request, Response} from 'express'
import {requireAuth} from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/dashboard', requireAuth, (req: Request, res: Response) => {
    res.render('dashboard')
})

export default router
