import express from 'express'
import type {Request, Response} from 'express'
import {checkWidgetEnabled} from '../middleware/checkWidgetEnabled.js'
import {getTextForWidget} from '../services/text/textService.js'
import {getQuestionsForWidget} from '../services/quiz/quizService.js'
import {fetchPhonetic} from '../services/dictionaryService.js'
import {getNews} from '../services/newsService.js'
import {getWeatherForCities} from '../services/weatherService.js'

const router = express.Router()

/**
 * @openapi
 * /w/{slug}:
 *   get:
 *     summary: Render a single widget page by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique slug of the widget
 *     responses:
 *       200:
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html><body>Widget Content</body></html>"
 *       404:
 *         description: Widget disabled or not found
 */
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

/**
 * @openapi
 * /w/{slug}/fetch:
 *   post:
 *     summary: Fetch data for a specific widget
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique slug of the widget
 *     responses:
 *       200:
 *         description: Successfully fetched widget data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                         example: "Miami"
 *                       temperature:
 *                         type: number
 *                         example: 22
 *                       desc:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                             example: "Clear sky"
 *                           icon:
 *                             type: string
 *                             example: "🌙"
 *       400:
 *         description: Unknown widget type
 *       500:
 *         description: Internal server error
 */
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
