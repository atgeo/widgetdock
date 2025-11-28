import {db} from '../db/db.js'
import {widgets} from '../db/schema.js'
import {and, eq, ne} from 'drizzle-orm'

const getAllWidgets = async () =>
    await db.select().from(widgets)

const getWidgetBySlug = async (slug: string) =>
    (await db.select().from(widgets).where(eq(widgets.slug, slug)).limit(1))[0] ?? null

const getWidgetById = async (id: number) =>
    (await db.select().from(widgets).where(eq(widgets.id, id)).limit(1))[0] ?? null

const setWidgetEnabled = async (id: number, enabled: boolean) =>
    db.update(widgets).set({
        enabled,
        updatedAt: new Date()
    }).where(and(eq(widgets.id, id), ne(widgets.enabled, enabled)))

export {getAllWidgets, getWidgetBySlug, getWidgetById, setWidgetEnabled}
