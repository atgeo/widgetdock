import express, {type Request, type Response} from 'express'
import {generateText} from '../services/openaiService.js'
import path from 'path'
import {fileURLToPath} from 'url'
import {fetchPhonetic} from '../services/dictionaryService.js'
import {checkWidgetEnabled} from '../middleware/checkWidgetEnabled.js'
import {db} from '../db/db.js'
import {widgets, prompts} from '../db/schema.js'
import {and, eq} from 'drizzle-orm'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/:name', checkWidgetEnabled, (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../views', 'quiz.html'))
})

router.post('/fetch', async (req: Request, res: Response) => {
    const allowedTypes = ['synonyms', 'synonyms_beginner']
    const {type, refresh} = req.body
    const sanitizedType = allowedTypes.includes(type) ? type : 'synonyms'

    try {
        const [widget] = await db
            .select()
            .from(widgets)
            .where(and(eq(widgets.name, sanitizedType), eq(widgets.type, 'quiz')))

        if (!widget) {
            return res.status(404).json({ error: "Widget not found" })
        }

        const [promptRow] = await db
            .select()
            .from(prompts)
            .where(eq(prompts.widget_id, widget.id))

        if (!promptRow) {
            return res.status(500).json({ error: "Prompt missing in database" })
        }

        const result = await generateText(promptRow.prompt, sanitizedType, refresh)
        res.json({result})
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({error: message})
    }
})

router.post('/phonetic', async (req: Request, res: Response) => {
    const {word} = req.body
    const result = await fetchPhonetic(word)
    res.json({result})
})

export default router
