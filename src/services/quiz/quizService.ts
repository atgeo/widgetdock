import {fetchQuestionsByQuizId, getQuizByWidgetId, saveQuestions} from '../../repositories/quizRepository.js'
import {quizQuestions, quizzes, widgets} from '../../db/schema.js'
import {and, eq} from 'drizzle-orm'
import {db} from '../../db/db.js'
import {generateText} from '../openai/openaiService.js'
import {parseQuizText} from './quizParsingService.js'
import {getPromptForWidgetOrFail} from '../promptService.js'
import {getWidgetById} from '../../repositories/widgetRepository.js'

export async function generateQuizQuestions(widgetId: number) {
    const widget = await getWidgetById(widgetId)
    if (!widget || widget.type !== 'quiz') throw new Error('Parent widget is not a quiz widget')

    const quiz = await getQuizByWidgetId(widgetId)
    if (!quiz) throw new Error('No quiz linked to this widget')

    const {prompt} = await getPromptForWidgetOrFail(widget.id)
    const rawText = await generateText(prompt)

    const questions = parseQuizText(rawText)

    await db.transaction(async (tx) => {
        await tx.delete(quizQuestions).where(eq(quizQuestions.quizId, quiz.id))

        await saveQuestions(quiz.id, questions)
    })
}

export async function getQuestionsForWidget(widgetId: number) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(and(eq(widgets.id, widgetId), eq(widgets.type, 'quiz')))

    if (!widget) {
        throw new Error(`Widget not found: ${widgetId}`)
    }

    const [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.widgetId, widget.id))

    if (!quiz) {
        throw new Error(`Quiz not found for widget: ${widget.name}`)
    }

    return await fetchQuestionsByQuizId(quiz.id)
}
