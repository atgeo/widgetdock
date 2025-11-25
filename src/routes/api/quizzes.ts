import express from 'express'
import type {Request, Response} from 'express'
import {generateQuizQuestions} from '../../services/quiz/quizService.js'
import {checkJwt} from '../../middleware/checkJwt.js'

const router = express.Router()

/**
 * @openapi
 * /api/quizzes/{id}/generate:
 *   post:
 *     summary: Generate a quiz by ID
 *     tags:
 *       - Widget Management
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the quiz
 *     responses:
 *       200:
 *         description: Quiz successfully generated
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
 *         description: Invalid quiz ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid quiz ID"
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
    const quizId = Number(req.params.id)

    if (!quizId || Number.isNaN(quizId)) {
        return res.status(400).json({error: 'Invalid quiz ID'})
    }

    try {
        await generateQuizQuestions(quizId)
        res.json({success: true, message: 'Quiz questions generated successfully'})
    } catch (err) {
        res.status(500).json({error: err instanceof Error ? err.message : 'Unknown error'})
    }
})

export default router
