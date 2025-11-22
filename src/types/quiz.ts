export interface QuizOption {
    id?: number
    questionId?: number
    text: string
    isCorrect: boolean
}

export interface QuestionWithOptions {
    id?: number
    widgetId?: number
    questionText: string
    options: QuizOption[]
}
