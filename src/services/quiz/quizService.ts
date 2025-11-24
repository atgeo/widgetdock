import {fetchQuestionsByWidgetId, saveQuestions} from '../../repositories/quizRepository.js'
import {widgets} from '../../db/schema.js'
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

    let questions: QuestionWithOptions[] = await fetchQuestionsByWidgetId(widget.id)

    if (!questions || !questions.length) {
        const {prompt} = await getPromptForWidgetOrFail(widget.id)
        const rawText = await generateText(prompt)

        questions = parseQuizText(rawText)

        await saveQuestions(widget.id, questions)
    }

    return questions
}
