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

    latitude: doublePrecision('latitude').notNull(),
    longitude: doublePrecision('longitude').notNull(),
    city: text('city').notNull(),

    temperature: doublePrecision('temperature').notNull(),
    condition: text('condition').notNull(),

    createdAt: timestamp('created_at', {withTimezone: true})
        .defaultNow()
        .notNull(),
}, (table) => ({
    uniqueLocation: unique('unique_location').on(table.latitude, table.longitude)
}))
