import express, {type Request, type Response} from 'express'
import {generateText} from '../services/openaiService.js'
import path from 'path'
import {fileURLToPath} from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../views', 'text.html'))
})

router.post('/generate', async (req: Request, res: Response) => {
    const allowedTypes = ['passage', 'dialogue']
    const {type, refresh} = req.body
    const sanitizedType = allowedTypes.includes(type) ? type : 'passage'

    try {
        const prompt = (sanitizedType === 'dialogue' ? process.env.PROMPT_DIALOGUE : process.env.PROMPT_PASSAGE)

        if (!prompt) {
            res.status(500).json({ error: "Prompt missing" })
            return
        }

        const result = await generateText(prompt, sanitizedType, refresh)
        res.json({result})
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({error: message})
    }
})

export default router
