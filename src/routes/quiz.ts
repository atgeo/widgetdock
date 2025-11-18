import express, {type Request, type Response} from 'express'
import {generateText} from '../services/openaiService.js'
import path from 'path'
import {fileURLToPath} from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../views', 'quiz.html'))
})

router.post('/fetch', async (req: Request, res: Response) => {
    const {type, refresh} = req.body

    try {
        const prompt = process.env.PROMPT_QUIZ_SYNONYMS

        if (!prompt) {
            res.status(500).json({ error: "Prompt missing" })
            return
        }

        const result = await generateText(prompt, type, refresh)
        res.json({result})
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({error: message})
    }
})

export default router
