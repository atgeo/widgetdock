import {db} from '../db/db.js'
import {quizzes, quizQuestions, quizOptions} from '../db/schema.js'
import {eq, inArray} from 'drizzle-orm'
import type {QuestionWithOptions, QuizOption} from '../types/quiz.js'

export async function fetchQuestionsByQuizId(quizId: number): Promise<QuestionWithOptions[]> {
    const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, quizId))

    const options = await db
        .select()
        .from(quizOptions)
        .where(inArray(quizOptions.questionId, questions.map((q) => q.id)))

    return questions.map(q => ({
        questionText: q.questionText,
        options: options
            .filter(o => o.questionId === q.id)
            .map(o => ({
                optionText: o.optionText,
                isCorrect: o.isCorrect,
            })),
    }))
}

export async function saveQuestions(quizId: number, questions: QuestionWithOptions[]) {
    for (const question of questions) {
        const [insertedQuestion] = await db
            .insert(quizQuestions)
            .values({
                quizId,
                questionText: question.questionText,
            })
            .returning({id: quizQuestions.id})

        if (!insertedQuestion) {
            throw new Error('Failed to insert quiz question')
        }

        const optionsToInsert = question.options.map((opt: QuizOption) => ({
            questionId: insertedQuestion.id,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
        }))

        if (optionsToInsert.length > 0) {
            await db.insert(quizOptions).values(optionsToInsert)
        }
    }
}
