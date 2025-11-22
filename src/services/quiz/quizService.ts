import {fetchQuestionsByWidgetId, saveQuestions} from '../../repositories/quizRepository.js'
import {prompts, widgets} from '../../db/schema.js'
import {and, eq} from 'drizzle-orm'
import {db} from '../../db/db.js'
import {generateText} from '../openai/openaiService.js'
import type {QuestionWithOptions} from '../../types/quiz.js'
import {parseQuizText} from './quizParsingService.js'

export async function getQuestionsForWidget(widgetName: string) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(and(eq(widgets.name, widgetName), eq(widgets.type, 'quiz')))

    if (!widget) {
        throw new Error(`Widget not found: ${widgetName}`)
    }

    let questions: QuestionWithOptions[] = await fetchQuestionsByWidgetId(widget.id)

    if (!questions || !questions.length) {
        // Fetch prompt for AI generation
        const [promptRow] = await db
            .select()
            .from(prompts)
            .where(eq(prompts.widgetId, widget.id))

        if (!promptRow) throw new Error('Prompt missing')

        const rawText = await generateText(promptRow.prompt)

        questions = parseQuizText(rawText)

        await saveQuestions(widget.id, questions)
    }

    return questions
}
