import {fetchQuestionsByQuizId, saveQuestions} from '../../repositories/quizRepository.js'
import {quizzes, widgets} from '../../db/schema.js'
import {and, eq} from 'drizzle-orm'
import {db} from '../../db/db.js'
import {generateText} from '../openai/openaiService.js'
import type {QuestionWithOptions} from '../../types/quiz.js'
import {parseQuizText} from './quizParsingService.js'
import {getPromptForWidgetOrFail} from '../promptService.js'

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

    let questions: QuestionWithOptions[] = await fetchQuestionsByQuizId(quiz.id)

    if (!questions || !questions.length) {
        const {prompt} = await getPromptForWidgetOrFail(widget.id)
        const rawText = await generateText(prompt)

        questions = parseQuizText(rawText)

        await saveQuestions(quiz.id, questions)
    }

    return questions
}
