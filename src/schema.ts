import {pgTable, serial, integer, timestamp, doublePrecision, unique, boolean, varchar} from 'drizzle-orm/pg-core'

export const weather = pgTable('weather',
    {
        id: serial('id').primaryKey(),

        latitude: doublePrecision().notNull(),
        longitude: doublePrecision().notNull(),
        city: varchar({length: 256}).notNull(),

        temperature: doublePrecision('temperature').notNull(),
        weather_code: integer('weather_code').notNull(),
        is_day: boolean('is_day').notNull(),

        createdAt: timestamp('created_at', {withTimezone: true})
            .defaultNow()
            .notNull(),
    }, (t) => [
        unique('unique_location').on(t.latitude, t.longitude),
    ],
)

export const widgets = pgTable('widgets', {
    id: serial('id'),

    name: varchar({length: 256}),
    enabled: boolean().default(true),
})
