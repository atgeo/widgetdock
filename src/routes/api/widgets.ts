import express from 'express'
import type {Request, Response} from 'express'
import {generateQuizQuestions} from '../../services/quiz/quizService.js'
import {checkJwt} from '../../middleware/checkJwt.js'
import {generateWidgetText} from '../../services/text/textService.js'
import {getWidgetById} from '../../repositories/widgetRepository.js'
import {toggleWidget} from '../../services/widgetService.js'

const router = express.Router()

/**
 * @openapi
 * /api/{id}/generate:
 *   post:
 *     summary: Generate data by widget ID
 *     tags:
 *       - Widget Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the widget
 *     responses:
 *       200:
 *         description: Widget successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Quiz questions generated successfully"
 *       400:
 *         description: Invalid widget ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid widget ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unknown error"
 */
router.post('/:id/generate', checkJwt, async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    if (!id || Number.isNaN(id)) {
        return res.status(400).json({error: 'Invalid widget ID'})
    }

    const widget = await getWidgetById(id)
    if (!widget) return res.status(404).json({message: 'Widget not found'})

    try {
        switch (widget.type) {
            case 'text':
                await generateWidgetText(id)
                res.json({success: true, message: 'Text generated successfully'})
                break
            case 'quiz':
                await generateQuizQuestions(id)
                res.json({success: true, message: 'Quiz questions generated successfully'})
                break
            default:
                res.status(400).json({message: 'Unsupported widget type'})
        }
    } catch (err) {
        res.status(500).json({error: err instanceof Error ? err.message : 'Unknown error'})
    }
})

/**
 * @openapi
 * /api/{id}:
 *   patch:
 *     summary: Enable or disable a widget
 *     tags:
 *       - Widget Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Widget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Widget enabled successfully
 *       400:
 *         description: Invalid widget ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid widget ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unknown error"
 */
router.patch('/:id', checkJwt, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (!id || Number.isNaN(id)) {
            return res.status(400).json({error: 'Invalid widget ID'})
        }

        const {enabled} = req.body || {}

        if (typeof enabled !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: '\'enabled\' field must be true or false'
            })
        }

        const result = await toggleWidget(id, enabled)
        res.json(result)
    } catch (err) {
        res.status(500).json({error: err instanceof Error ? err.message : 'Unknown error'})
    }
})

export default router
