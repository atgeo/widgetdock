import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { getWeatherForCities } from '../services/weatherService.js'
import { getNews } from '../services/newsService.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../templates', 'ticker.html'))
})

router.post('/fetch', async (req, res) => {
  const { type } = req.body

  try {
    let items = []

    if (type === 'news') {
      items = await getNews()
    } else {
      const cities = ['Miami', 'Toronto', 'Paris', 'Beirut', 'Nairobi',
        'Dubai', 'New Delhi', 'Jakarta', 'Singapore', 'Tokyo', 'Sydney']

      const results = await getWeatherForCities(cities)

      items = results.filter(r => !r.error).map(r => ({
          city: r.city,
          temperature: Math.round(r.temperature),
          desc: r.desc,
        }),
      )
    }

    return res.json({ items })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
