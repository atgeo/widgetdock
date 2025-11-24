import express from 'express'
import type {Request, Response} from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import {checkWidgetEnabled} from '../middleware/checkWidgetEnabled.js'
import {getTextForWidget} from '../services/text/textService.js'
import {getQuestionsForWidget} from '../services/quiz/quizService.js'
import {fetchPhonetic} from '../services/dictionaryService.js'
import {getNews} from '../services/newsService.js'
import {getWeatherForCities} from '../services/weatherService.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/:slug', checkWidgetEnabled, async (req: Request, res: Response) => {
    const widget = req.widget

    if (!widget)
        return res.status(404).json({error: 'Widget not found'})

    const file =
        widget.type === 'text' ? 'text.html' :
            widget.type === 'quiz' ? 'quiz.html' :
                widget.type === 'ticker' ? 'ticker.html' :
                    null

    if (!file)
        return res.status(500).json({error: 'Invalid widget type'})

    res.sendFile(path.join(__dirname, '../../views', file))
})

router.post('/:slug/fetch', checkWidgetEnabled, async (req: Request, res: Response) => {
    const widget = req.widget

    try {
        let result

        if (widget.type === 'text') {
            result = await getTextForWidget(widget.slug)
        } else if (widget.type === 'quiz') {
            result = await getQuestionsForWidget(widget.slug)
        } else if (widget.type === 'ticker') {
            if (widget.slug === 'news') {
                result = await getNews()
            } else {
                const cities = (process.env.WEATHER_CITIES || '').split(',')

                const results = await getWeatherForCities(cities)

                result = results
                    .filter((r): r is NonNullable<typeof r> => r !== undefined)
                    .map(r => ({
                            city: r.city,
                            temperature: Math.round(r.temperature),
                            desc: r.desc,
                        }),
                    )
            }
        } else {
            throw new Error('Unknown widget type')
        }

        res.json({result})
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        res.status(500).json({error: message})
    }
})

router.post('/:slug/phonetic', async (req: Request, res: Response) => {
    const {word} = req.body
    const result = await fetchPhonetic(word)
    res.json({result})
})

export default router
