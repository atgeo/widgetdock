import {db} from '../db/db.js'
import {widgets} from '../db/schema.js'
import {and, eq, ne} from 'drizzle-orm'

export async function getAllWidgets() {
    return db.select().from(widgets)
}

export async function getWidgetBySlug(slug: string) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(eq(widgets.slug, slug))
        .limit(1)

    return widget ?? null
}

export async function getWidgetById(id: number) {
    const [widget] = await db
        .select()
        .from(widgets)
        .where(eq(widgets.id, id))
        .limit(1)

    return widget ?? null
}

export async function setWidgetEnabled(id: number, enabled: boolean) {
    return db
        .update(widgets)
        .set({
            enabled,
            updatedAt: new Date(),
        })
        .where(and(eq(widgets.id, id), ne(widgets.enabled, enabled)))
}
