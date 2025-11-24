import express from 'express'
import type {Request, Response} from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import {getWeatherForCities} from '../services/weatherService.js'
import {getNews} from '../services/newsService.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.post('/fetch', async (req: Request, res: Response) => {
    const {type} = req.body

    try {
        let items

        if (type === 'news') {
            items = await getNews()
        } else {
            const cities = (process.env.WEATHER_CITIES || '').split(',')

            const results = await getWeatherForCities(cities)

            items = results
                .filter((r): r is NonNullable<typeof r> => r !== undefined)
                .map(r => ({
                        city: r.city,
                        temperature: Math.round(r.temperature),
                        desc: r.desc,
                    }),
                )
        }

        return res.json({items})
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({error: message})
    }
})

export default router
