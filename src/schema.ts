import {
    pgTable,
    serial, text,
    integer,
    timestamp,
    doublePrecision,
    unique
} from 'drizzle-orm/pg-core'

export const weather = pgTable('weather', {
    id: serial('id').primaryKey(),

    lat: doublePrecision('lat').notNull(),
    lon: doublePrecision('lon').notNull(),
    city: text('city'),

    temperature: integer('temperature').notNull(),
    condition: text('condition').notNull(),

    createdAt: timestamp('created_at', {withTimezone: true})
        .defaultNow()
        .notNull(),
}, (table) => ({
    uniqueLocation: unique('unique_location').on(table.lat, table.lon)
}))
