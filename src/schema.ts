import {pgTable, serial, text, integer, timestamp, doublePrecision, unique, boolean} from 'drizzle-orm/pg-core'

export const weather = pgTable('weather', {
    id: serial('id').primaryKey(),

    latitude: doublePrecision('latitude').notNull(),
    longitude: doublePrecision('longitude').notNull(),
    city: text('city').notNull(),

    temperature: doublePrecision('temperature').notNull(),
    weather_code: integer('weather_code').notNull(),
    is_day: boolean('is_day').notNull(),

    createdAt: timestamp('created_at', {withTimezone: true})
        .defaultNow()
        .notNull(),
    },
    (t) => [
        unique('unique_location').on(t.latitude, t.longitude),
    ],
)
