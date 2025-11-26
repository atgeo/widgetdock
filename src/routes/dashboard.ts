import express from 'express'
import type {Request, Response} from 'express'
import {requireAuthView} from '../middleware/requireAuthView.js'
import {getAllWidgets} from '../repositories/widgetRepository.js'

const router = express.Router()

router.get('/dashboard', requireAuthView, async (req: Request, res: Response) => {
    const widgets = await getAllWidgets()

    res.render('dashboard', {user: req.user, widgets})
})

export default router
