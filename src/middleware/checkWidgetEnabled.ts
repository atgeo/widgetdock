import type {Request, Response, NextFunction} from 'express'
import {getWidgetBySlug} from '../repositories/widgetRepository.js'

export async function checkWidgetEnabled(req: Request, res: Response, next: NextFunction) {
    const widgetName = req.params.slug

    if (!widgetName) {
        return res.status(400).send('Widget name is required')
    }

    try {
        const widget = await getWidgetBySlug(widgetName)

        if (!widget || widget.enabled !== true) {
            return res.status(404).send('Widget disabled or not found')
        }

        // optionally attach widget to req for later handlers
        req.widget = widget
        next()
    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }
}
