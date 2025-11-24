import express from 'express'
import type {Request, Response} from 'express'
import {generateWidgetText} from '../../services/text/textService.js'

const router = express.Router()

router.post('/:id/generate', async (req: Request, res: Response) => {
    const widgetId = Number(req.params.id)

    if (!widgetId || Number.isNaN(widgetId)) {
        return res.status(400).json({error: 'Invalid widget ID'})
    }

    try {
        await generateWidgetText(widgetId)
        res.json({success: true, message: 'Text generated successfully'})
    } catch (err) {
        res.status(500).json({error: err instanceof Error ? err.message : 'Unknown error'})
    }
})

export default router
