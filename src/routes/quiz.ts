import express, {type Request, type Response} from 'express'
import {generateText} from '../services/openaiService.js'
import path from 'path'
import {fileURLToPath} from 'url'
import {fetchPhonetic} from '../services/dictionaryService.js'
import {checkWidgetEnabled} from '../middleware/checkWidgetEnabled.js'
import {getPromptForWidgetOrFail} from '../services/promptService.js'

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
        const {prompt} = await getPromptForWidgetOrFail(sanitizedType, 'quiz')

        const result = await generateText(prompt, sanitizedType, refresh)
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
