import express from 'express'
import type {Request, Response} from 'express'
import {generateWidgetText} from '../../services/text/textService.js'

const router = express.Router()

/**
 * @openapi
 * /api/texts/{id}/generate:
 *   post:
 *     summary: Generate a text by widget ID
 *     tags:
 *       - Widget Management
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the widget
 *     responses:
 *       200:
 *         description: Text successfully generated
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
 *                   example: "Text generated successfully"
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
router.post('/:id/generate', async (req: Request, res: Response) => {
    const widgetId = Number(req.params.id)

    if (!widgetId || Number.isNaN(widgetId)) {
        return res.status(400).json({error: 'Invalid widget ID'})
    }

    try {
        await generateWidgetText(widgetId)
        res.json({success: true, message: 'Text generated successfully'})
    } catch (err) {
        res.status(500).json({error: err instanceof Error ? err.message : 'Unknown error'})
    }
})

export default router
