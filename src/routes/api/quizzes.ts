import express from 'express'
import type {Request, Response} from 'express'
import {generateQuizQuestions} from '../../services/quiz/quizService.js'

const router = express.Router()

router.post('/:id/generate', async (req: Request, res: Response) => {
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

    res.json()
})

export default router
