import express from 'express'
import type {Request, Response} from 'express'
import {checkWidgetEnabled} from '../middleware/checkWidgetEnabled.js'
import {getTextForWidget} from '../services/text/textService.js'
import {getQuestionsForWidget} from '../services/quiz/quizService.js'
import {fetchPhonetic} from '../services/dictionaryService.js'
import {getNews} from '../services/newsService.js'
import {getWeatherForCities} from '../services/weatherService.js'

const router = express.Router()

router.get('/:slug', checkWidgetEnabled, async (req: Request, res: Response) => {
    const widget = req.widget

    if (!widget)
        return res.status(404).json({error: 'Widget not found'})

    let template, results

    switch (widget.type) {
        case 'text':
            template = 'widgets/text'
            results = await getTextForWidget(widget.id)
            break
        case 'quiz':
            template = 'widgets/quiz'
            results = await getQuestionsForWidget(widget.id)
            break
        case 'ticker':
            template = 'widgets/ticker'
            break
        default:
            return res.status(400).json({error: 'Unknown widget type'})
    }

    res.render(template, {widget, results})
})

router.post('/:slug/fetch', checkWidgetEnabled, async (req: Request, res: Response) => {
    const widget = req.widget

    try {
        let result

        switch (widget.type) {
            case 'ticker':
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
                break
            default:
                res.status(400).json({error: 'Unknown widget type'})
                return
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
