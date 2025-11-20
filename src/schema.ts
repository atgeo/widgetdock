import {pgTable, text, integer, timestamp} from "drizzle-orm/pg-core"

export const weather = pgTable("weather", {
    city: text("city").primaryKey(),
    temperature: integer("temperature").notNull(),
    condition: text("condition").notNull(),
    createdAt: timestamp("created_at", {withTimezone: true})
        .defaultNow()
        .notNull(),
})
