import express, {type Request, type Response} from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import {getTextForWidget} from '../services/text/textService.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.post('/generate', async (req: Request, res: Response) => {
    const allowedTypes = ['passage', 'dialogue']
    const {type, refresh} = req.body
    const sanitizedType = allowedTypes.includes(type) ? type : 'passage'

    try {
        const result = await getTextForWidget(sanitizedType)
        res.json({result})
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({error: message})
    }
})

export default router
