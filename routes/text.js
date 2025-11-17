import express from 'express'
import { generateText } from '../services/openaiService.js'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../templates', 'text.html'))
})

router.post('/generate', async (req, res) => {
  const { mode, refresh } = req.body

  try {
    const prompt = (mode === 'dialogue'
      ? process.env.PROMPT_DIALOGUE
      : process.env.PROMPT_PASSAGE)

    const result = await generateText(prompt, mode, refresh)
    res.json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
