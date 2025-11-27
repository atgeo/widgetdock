import express from 'express'
import type {Request, Response} from 'express'
import {requireAuthView} from '../middleware/requireAuthView.js'
import {getAllWidgets} from '../repositories/widgetRepository.js'

const router = express.Router()

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get the dashboard page
 *     description: Returns the dashboard view with user information and widgets. Redirects to login if the user is not authenticated.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Dashboard page rendered successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/dashboard', requireAuthView, async (req: Request, res: Response) => {
    const widgets = await getAllWidgets()

    res.render('dashboard', {user: req.user, widgets})
})

export default router
