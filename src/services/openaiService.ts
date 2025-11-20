import OpenAI from 'openai'
import fs from 'fs'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

if (!process.env.OPENAI_MODEL) {
    throw new Error("MODEL environment variable is required")
}

const model = process.env.OPENAI_MODEL

const CACHE_DIR = './cache'

function loadCache (type = 'passage') {
  const CACHE_FILE = `${CACHE_DIR}/${type}.txt`
  if (fs.existsSync(CACHE_FILE)) {
    return fs.readFileSync(CACHE_FILE, 'utf-8')
  }
  return null
}

function saveCache (text: string, type = 'passage') {
  const CACHE_FILE = `${CACHE_DIR}/${type}.txt`
  fs.writeFileSync(CACHE_FILE, text, 'utf-8')
}

export async function generateText (prompt: string, type: string, refresh: boolean) {
  if (!refresh) {
    const cachedData = loadCache(type)
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
    model: model,
  })

  const freshData = completion.choices?.[0]?.message.content || 'No content returned'
  saveCache(freshData, type)

  return freshData
}
