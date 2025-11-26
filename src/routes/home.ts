import {Router} from 'express'
import type {Request, Response} from 'express'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
    res.render('home', {
        title: 'WidgetDock',
        subtitle: 'Your widgets, perfectly docked.',
        loginUrl: '/login',
        currentYear: new Date().getFullYear(),
    })
})

export default router
