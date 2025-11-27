import {Router} from 'express'
import type {Request, Response} from 'express'

const router = Router()

/**
 * @openapi
 * /:
 *   get:
 *     summary: Render the homepage
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Homepage rendered successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', (_req: Request, res: Response) => {
    res.render('home', {
        title: 'WidgetDock',
        subtitle: 'Your widgets, perfectly docked.',
        loginUrl: '/login',
        currentYear: new Date().getFullYear(),
    })
})

export default router
