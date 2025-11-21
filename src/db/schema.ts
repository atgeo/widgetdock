import {pgTable, serial, integer, timestamp, doublePrecision, unique, boolean, varchar, text} from 'drizzle-orm/pg-core'

export const weather = pgTable('weather',
    {
        id: serial('id').primaryKey(),

        latitude: doublePrecision().notNull(),
        longitude: doublePrecision().notNull(),
        city: varchar({length: 256}).notNull(),

        temperature: doublePrecision('temperature').notNull(),
        weatherCode: integer('weather_code').notNull(),
        isDay: boolean('is_day').notNull(),

        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    }, (t) => [
        unique('unique_location').on(t.latitude, t.longitude),
    ],
)

export const widgets = pgTable('widgets',
    {
        id: serial('id').primaryKey(),

        name: varchar({length: 256}).notNull(),
        type: varchar({length: 256}).notNull(),
        enabled: boolean().default(true),

        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
    }, (t) => [
        unique('unique_name_type').on(t.name, t.type)
    ],
)

export const prompts = pgTable('prompts', {
    id: serial('id').primaryKey(),

    widgetId: integer('widget_id')
        .references(() => widgets.id, {onDelete: 'cascade'})
        .notNull(),

    prompt: text('prompt').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const quizQuestions = pgTable("quiz_questions", {
    id: serial('id').primaryKey(),

    widgetId: integer('widget_id')
        .references(() => widgets.id, {onDelete: 'cascade'})
        .notNull(),

    questionText: text('question_text').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const quizOptions = pgTable("quiz_options", {
    id: serial('id').primaryKey(),

    questionId: integer('question_id')
        .references(() => quizQuestions.id)
        .notNull(),

    optionText: varchar('option_text', {length: 256}).notNull(),
    isCorrect: boolean('is_correct').default(false).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
