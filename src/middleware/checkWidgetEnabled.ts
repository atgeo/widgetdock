import type {Request, Response, NextFunction} from 'express'
import {db} from '../db.js'
import {widgets} from '../schema.js'
import {eq} from "drizzle-orm"

export async function checkWidgetEnabled(req: Request, res: Response, next: NextFunction) {
    const widgetName = req.params.name
    console.log(`Checking widget ${widgetName}`)

    if (!widgetName) {
        return res.status(400).send('Widget name is required')
    }

    try {
        const widget = await db
            .select()
            .from(widgets)
            .where(eq(widgets.name, widgetName))

        if (!widget[0] || widget[0].enabled !== true) {
            return res.status(404).send('Widget disabled or not found')
        }

        // optionally attach widget to req for later handlers
        (req as any).widget = widget[0]
        next()
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
}
