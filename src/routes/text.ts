import express, {type Request, type Response} from 'express'
import {generateText} from '../services/openaiService.js'
import path from 'path'
import {fileURLToPath} from 'url'
import {checkWidgetEnabled} from '../middleware/checkWidgetEnabled.js'
import {getPromptForWidgetOrFail} from '../services/promptService.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/:name', checkWidgetEnabled, (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../views', 'text.html'))
})

router.post('/generate', async (req: Request, res: Response) => {
    const allowedTypes = ['passage', 'dialogue']
    const {type, refresh} = req.body
    const sanitizedType = allowedTypes.includes(type) ? type : 'passage'

    try {
        const {prompt} = await getPromptForWidgetOrFail(sanitizedType, 'text')

        const result = await generateText(prompt, sanitizedType, refresh)
        res.json({result})
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({error: message})
    }
})

export default router
