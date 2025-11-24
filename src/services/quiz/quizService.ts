import {fetchQuestionsByQuizId, saveQuestions} from '../../repositories/quizRepository.js'
import {quizQuestions, quizzes, widgets} from '../../db/schema.js'
import {and, eq} from 'drizzle-orm'
import {db} from '../../db/db.js'
import {generateText} from '../openai/openaiService.js'
import {parseQuizText} from './quizParsingService.js'
import {getPromptForWidgetOrFail} from '../promptService.js'

export async function generateQuizQuestions(quizId: number) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId))

    if (!quiz) throw new Error('Quiz not found')

    const [widget] = await db.select().from(widgets).where(eq(widgets.id, quiz.widgetId));
    if (!widget || widget.type !== 'quiz') throw new Error('Parent widget is not a quiz widget')

    const {prompt} = await getPromptForWidgetOrFail(widget.id)
    const rawText = await generateText(prompt)

    const questions = parseQuizText(rawText)

    await db.transaction(async (tx) => {
        await tx.delete(quizQuestions).where(eq(quizQuestions.quizId, quiz.id))

        await saveQuestions(quiz.id, questions)
    })
}

export async function getQuestionsForWidget(widgetName: string) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(and(eq(widgets.slug, widgetName), eq(widgets.type, 'quiz')))

    if (!widget) {
        throw new Error(`Widget not found: ${widgetName}`)
    }

    const [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.widgetId, widget.id));

    if (!quiz) {
        throw new Error(`Quiz not found for widget: ${widgetName}`);
    }

    return await fetchQuestionsByQuizId(quiz.id)
}
