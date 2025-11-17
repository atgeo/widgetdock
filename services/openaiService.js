import OpenAI from 'openai'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const CACHE_DIR = './cache'

function loadCache (mode = 'passage') {
  const CACHE_FILE = `${CACHE_DIR}/${mode}.txt`
  if (fs.existsSync(CACHE_FILE)) {
    return fs.readFileSync(CACHE_FILE, 'utf-8')
  }
  return null
}

function saveCache (text, mode = 'passage') {
  const CACHE_FILE = `${CACHE_DIR}/${mode}.txt`
  fs.writeFileSync(CACHE_FILE, text, 'utf-8')
}

export async function generateText (prompt, mode, refresh) {
  if (!refresh) {
    const cachedData = loadCache(mode)
    if (cachedData) return cachedData
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'developer',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: process.env.MODEL,
  })

  const freshData = completion.choices[0].message.content
  saveCache(freshData, mode)

  return completion.choices[0].message.content
}
