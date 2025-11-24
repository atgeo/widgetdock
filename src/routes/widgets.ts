import express, {Router} from 'express'
import type {Request, Response} from 'express'
import {getWidgetBySlug} from '../services/widgets.js'
import path from 'path'
import {fileURLToPath} from 'url'
import {checkWidgetEnabled} from '../middleware/checkWidgetEnabled.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/:slug', checkWidgetEnabled, async (req: Request, res: Response) => {
    const widget = req.widget

    if (!widget)
        return res.status(404).json({error: 'Widget not found'})

    const file =
        widget.type === 'text' ? 'text.html' :
            widget.type === 'quiz' ? 'quiz.html' :
                widget.type === 'ticker' ? 'ticker.html' :
                    null

    if (!file)
        return res.status(500).json({ error: 'Invalid widget type' })

    res.sendFile(path.join(__dirname, '../../views', file))
})

export default router
