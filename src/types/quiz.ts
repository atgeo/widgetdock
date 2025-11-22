export interface QuizOption {
    id?: number
    questionId?: number
    optionText: string
    isCorrect: boolean
}

export interface QuestionWithOptions {
    id?: number
    widgetId?: number
    questionText: string
    options: QuizOption[]
}
