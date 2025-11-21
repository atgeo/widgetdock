import {pgTable, serial, integer, timestamp, doublePrecision, unique, boolean, varchar, text} from 'drizzle-orm/pg-core'

export const weather = pgTable('weather',
    {
        id: serial('id').primaryKey(),

        latitude: doublePrecision().notNull(),
        longitude: doublePrecision().notNull(),
        city: varchar({length: 256}).notNull(),

        temperature: doublePrecision('temperature').notNull(),
        weather_code: integer('weather_code').notNull(),
        isDay: boolean('is_day').notNull(),

        createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    }, (t) => [
        unique('unique_location').on(t.latitude, t.longitude),
    ],
)

export const widgets = pgTable('widgets', {
    id: serial('id').primaryKey(),

    name: varchar({length: 256}).notNull(),
    type: varchar({length: 256}).notNull(),
    enabled: boolean().default(true),

    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull(),
})

export const prompts = pgTable('prompts', {
    id: serial('id').primaryKey(),

    widget_id: integer('widget_id')
        .references(() => widgets.id, {onDelete: 'cascade'})
        .notNull(),

    prompt: text('prompt').notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
