import {pgTable, serial, integer, timestamp, doublePrecision, unique, boolean, varchar, text} from 'drizzle-orm/pg-core'

export const weather = pgTable('weather', {
        id: serial().primaryKey(),

        latitude: doublePrecision().notNull(),
        longitude: doublePrecision().notNull(),
        city: varchar({length: 256}).notNull(),

        temperature: doublePrecision().notNull(),
        weatherCode: integer('weather_code').notNull(),
        isDay: boolean('is_day').notNull(),

        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
    }, (t) => [
        unique('unique_location').on(t.latitude, t.longitude),
    ],
)

export const widgets = pgTable('widgets', {
        id: serial().primaryKey(),

        name: varchar({length: 256}).notNull(),
        description: text(),
        slug: varchar({length: 256}).notNull(),
        type: varchar({length: 256}).notNull(),
        enabled: boolean().default(true),

        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
    }, (t) => [
        unique('unique_name_type').on(t.name, t.type)
    ],
)

export const prompts = pgTable('prompts', {
    id: serial().primaryKey(),

    widgetId: integer('widget_id')
        .references(() => widgets.id, {onDelete: 'cascade'})
        .notNull(),

    prompt: text().notNull(),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})

export const quizzes = pgTable('quizzes', {
    id: serial().primaryKey(),

    widgetId: integer('widget_id')
        .references(() => widgets.id, {onDelete: 'cascade'})
        .notNull(),

    description: text().notNull(),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})

export const quizQuestions = pgTable('quiz_questions', {
    id: serial().primaryKey(),

    quizId: integer('quiz_id')
        .references(() => quizzes.id, {onDelete: 'cascade'})
        .notNull(),

    questionText: text('question_text').notNull(),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})

export const quizOptions = pgTable('quiz_options', {
    id: serial().primaryKey(),

    questionId: integer('question_id')
        .references(() => quizQuestions.id, {onDelete: 'cascade'})
        .notNull(),

    optionText: varchar('option_text', {length: 256}).notNull(),
    isCorrect: boolean('is_correct').default(false).notNull(),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})

export const widgetTexts = pgTable('widget_texts', {
        id: serial().primaryKey(),

        widgetId: integer('widget_id')
            .references(() => widgets.id, {onDelete: 'cascade'})
            .notNull(),

        content: text().notNull(),

        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
    }, (t) => [
        unique('unique_widget_id').on(t.widgetId),
    ],
)

export const users = pgTable('users', {
    id: serial().primaryKey(),

    username: varchar({length: 256}).notNull().unique(),
    password: varchar({length: 256}).notNull(),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})

export const roles = pgTable('roles', {
    id: serial().primaryKey(),

    name: varchar({length: 256}).notNull().unique(),
    description: text(),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})

export const permissions = pgTable('permissions', {
    id: serial().primaryKey(),

    name: varchar({length: 256}).notNull().unique(),
    description: text(),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})

export const userRoles = pgTable('user_roles', {
    userId: integer('user_id')
        .notNull()
        .references(() => users.id, {onDelete: 'cascade'}),

    roleId: integer('role_id')
        .notNull()
        .references(() => roles.id, {onDelete: 'cascade'}),
})

export const rolePermissions = pgTable('role_permissions', {
    roleId: integer('role_id')
        .notNull()
        .references(() => roles.id, {onDelete: 'cascade'}),

    permissionId: integer('permission_id')
        .notNull()
        .references(() => permissions.id, {onDelete: 'cascade'}),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})
