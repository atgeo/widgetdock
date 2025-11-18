import express, {type Request, type Response} from 'express'
import path from 'path'
import {fileURLToPath} from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../views', 'quiz.html'))
})

export default router
