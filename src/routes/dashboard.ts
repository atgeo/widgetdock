import express from 'express'
import type {Request, Response} from 'express'
import {requireAuthView} from '../middleware/requireAuthView.js'

const router = express.Router()

router.get('/dashboard', requireAuthView, (req: Request, res: Response) => {
    res.render('dashboard')
})

export default router
