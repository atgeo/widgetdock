import type {QuestionWithOptions} from '../../types/quiz.js'

interface RawAIQuestion {
    word: string
    options: string[]
}

export function parseQuizText(rawText: string): QuestionWithOptions[] {
    let parsed: RawAIQuestion[]

    try {
        parsed = JSON.parse(rawText)
    } catch (err) {
        throw new Error('Failed to parse AI response as JSON')
    }

    return parsed.map((q): QuestionWithOptions => ({
        questionText: q.word,
        options: q.options.map((opt, i) => ({
            optionText: opt,
            isCorrect: i === 0,
        })),
    }))
}
